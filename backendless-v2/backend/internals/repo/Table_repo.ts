import type { DatabaseError, Pool, QueryResult } from "pg"
import { ConsoleLogger, CreateFileLogger } from "../../logger.js"
import { Utils } from "../utils/utils.js"
 
import type { InsertStruct, Update_AppendStruct, WhereStruct } from "../models.js"
import type { UUID } from "node:crypto"
import { AppError, CreateColumnsError, CreateUsersTableError, FindUserTableError, GetTableDataError } from "../../error/error.js"




export class TableRepo {
    db: Pool
    logger = CreateFileLogger("table.log")
    consolelogger = ConsoleLogger(true)
    utils = new Utils()
    constructor(db: Pool) {
        this.db = db
    }


    async CreateUsersTable(userid: string, table_name: string):Promise<UUID>  {
        try {
            let values: InsertStruct[] = [
                {
                    column_name: "user_id",
                    value: userid
                },
                {
                    column_name: "table_name",
                    value: table_name
                }
            ]

            //let insert_values=this.utils.InsertQueryStringValueBuilder(values)
            let query = `insert into users_tables`
            query = this.utils.InsertQueryBuilder(query, values)
            this.logger.info("dynamic_quer is ",{query})

            query += " RETURNING table_id"



            let rows = await this.db.query(query,this.utils.GetValues(values))
           
            if (rows.rowCount==0) throw new CreateUsersTableError("no uuid value for tale name ","CreateUsersTable",400)

            this.consolelogger.info("created a table")
            return rows.rows[0].table_id
        } catch (err) {
            if (err instanceof AppError) throw err

            
            throw new Error("error occurred whiel creaing a table", {
                cause:err
            });
            
        }
    }
    async FindUserTable(userid:string):Promise<any[]>{
        try {
            let query=`SELECT table_id,table_name,columns from users_tables
            where 
            user_id=$1`    
            let rows=await this.db.query(query,[userid])
            
            if(rows.rows.length==0){
                this.consolelogger.info("no tables found for the user");
                return []
            }
            //throw new FindUserTableError("table not assosciated with the user","FindUserTable",400)

            return rows.rows
        } catch (error) {
            if (error instanceof AppError) throw error
            
            throw new Error("error while finding the user table",{cause:error})
        }
    }
    //table uniqness is constraint in db 

    async CreateColumns(table_id:UUID,columns:any){
        try {
            let values:InsertStruct[]=[
                {
                    column_name:"columns",
                    value:columns
                }
            ]
            
            let baseQuery = `UPDATE users_tables SET`;
            let wherevalues:WhereStruct[]=[{value:"table_id"}]
            let { query, counter } =this.utils.BuildJsonbUpateQuery(baseQuery, values);// query=query+" WHERE"
            query=query+" WHERE"
            query= this.utils.UpdateWhereQueryBuilder(query,wherevalues,counter)

            this.logger.info("dynamic_quer is ",{query})
            let rows = await this.db.query(query,[this.utils.ConvertColumnsArrayToObject(values[0]?.value),table_id])
            
            
            if (rows.rowCount==0) throw new CreateColumnsError( "not able to create columns","CreateColumns",400)
            
        } catch (error) {
            if (error instanceof AppError)throw error
            throw new Error("error while createing columns",{cause:error}) 
        }
    } 
    
    //can also be usid in ifniddng  columns  
    


    async GetTableData(user_id:UUID,table_id:UUID){
        try {
            let query="SELECT id,tenant_user_identifier,data FROM table_row where table_id=$1"

            let rows= await this.db.query(query,[table_id])

            if (rows.rows.length==0){
                this.consolelogger.info("no data in the table")
                return []
            }
            //throw new GetTableDataError("no rows in the table","GetTableData",401)
            return rows.rows
        } catch (error) {
            if(error instanceof AppError){
                throw error
            }
            throw new Error("unabel to get table data",{cause:error})
        }
    }
 
    async GetColumns(user_id:UUID,table_id:UUID){
        try {
            let query="SELECT columns from users_tables where user_id=$1 and table_id=$2"
            let rows=await this.db.query(query,[user_id,table_id])
            if (rows.rows.length==0){
                this.consolelogger.info("no data in the table")
                return []
            }
            return rows.rows

        } catch (error) {
            throw new Error("unabel to get columns ",{cause:error})
        }
    }                     

    async DeleteTable(tenant_id:UUID,table_id:UUID){
        try {
            let query="delete from users_tables where user_id=$1 and table_id=$2"
            let rows=await this.db.query(query,[tenant_id,table_id])

            if (rows.rowCount==0){
                this.consolelogger.info("no table was delted for the user")
                return
            }

        } catch (error) {
            throw new Error("failed to delte the table",{cause:error})
        }
    }   
    
    async DeleteTableRows(table_id:UUID){
        try {
            let query="delete from table_row where table_id=$1"
            let rows=await this.db.query(query,[table_id])

            if (rows.rowCount==0){
                this.consolelogger.info("no table rows was delted for the user")
                return
            }

        } catch (error) {
            throw new Error("failed to delte the table rows",{cause:error})
        }
    }
}

