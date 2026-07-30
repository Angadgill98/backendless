import type { Pool } from "pg"
import { ConsoleLogger, CreateFileLogger } from "../../logger.js"
import { Utils } from "../utils/utils.js"
import { TableRepo } from "../repo/Table_repo.js"
import type { UUID } from "node:crypto"
import { Redis_repo } from "../repo/Redis_repo.js"
import type { RedisClientType } from "redis"
import { AppError } from "../../error/error.js"





export class TableServices {
    table_repo: TableRepo
    logger = CreateFileLogger("table.log")
    consolelogger = ConsoleLogger(true)
    utils = new Utils()
    redis:Redis_repo
    constructor(db: Pool,rdb:RedisClientType) {
        this.table_repo = new TableRepo(db)
        this.redis=new Redis_repo(rdb) 
    }
    async CreateTable(userid:string,table_name:string):Promise<UUID>{
        try {
            //add string validation
            let table_id=await this.table_repo.CreateUsersTable(userid,table_name)
            return table_id
        } catch (error) {
            if (error instanceof AppError){
                throw error
            }
                        
            throw new Error("failed to create a table",{cause:error}) 
        }
    }
    async FindUserTables(userid:string){
        try {
            //vlaidation for string \

            let rows=await this.table_repo.FindUserTable(userid)
            this.consolelogger.info("table_id nad columns struct is",{rows})
            
            return rows
        } catch (error) {
            if (error instanceof AppError){
                throw error
            }
                        
            this.consolelogger.error("failed to FInd user table ",{error}) 
            throw new Error("failed to FInd user table ",{cause:error})
        }
    }
    async CreateColumns(user_id:UUID,table_name:string,table_id:UUID,columns:any[]){
        try {
            //validation for string
     
            let flattenSchema=this.utils.FlattenSchema(Object.assign({}, ...columns))
            this.consolelogger.info("flatten schema is: ",flattenSchema)

            let isexist:number=await this.redis.IsExist(user_id,table_name)
            if (isexist) {
                let old_schmea:Map<String,String>=await this.redis.GetFlatenSchema(user_id,table_name)
                let oldSchemaRecord:Record<string,string> = Object.fromEntries(old_schmea);

                let combined = {
                    ...oldSchemaRecord,
                    ...flattenSchema,
                };
                await this.redis.UpdateFlattenSchema(user_id,table_name,combined)
            }else{
                await this.redis.SetFlattenSchema(user_id,table_name,flattenSchema)
            }

            
            await this.table_repo.CreateColumns(table_id,columns)
        } catch (error) {
            if (error instanceof AppError){
                throw error
            }
                        
            throw new Error("failed to create columns",{cause:error})
        }
    }
    
    async UpdateSchema(userid:UUID,table_name:string,table_id:UUID,columns:any[]){
        try {
            let flattenSchema=this.utils.FlattenSchema(Object.assign({}, ...columns))
            this.consolelogger.info("flatten schema is: ",flattenSchema)

            let oldSchema = await this.redis.GetFlatenSchema(userid, table_name);
            let oldSchemaRecord: Record<string, string> = Object.fromEntries(oldSchema);

            // Update only the keys present in flattenSchema
            Object.assign(oldSchemaRecord, flattenSchema);

            await this.table_repo.CreateColumns(table_id,columns)

            await this.redis.UpdateFlattenSchema(userid,table_name,oldSchemaRecord)
            
        } catch (error) {
            if (error instanceof AppError){
                throw error
            }
                        
             
            throw new Error("failed to UpdateSchema",{cause:error})
        }
    }

    async GetTableData(userid:UUID,table_id:UUID){
        try {
            let rows=await this.table_repo.GetTableData(userid,table_id)
            // let columns=await this.table_repo.GetColumns(userid,table_id)
            // return {table_data:rows,columns}
            return rows
        } catch (error) {
            if  (error instanceof AppError){
                throw error 
            }
            throw error
        }
    }

    async DeleteTable(tenant_id:UUID,table_id:UUID){
        try {
            await this.table_repo.DeleteTable(tenant_id,table_id)
            await this.table_repo.DeleteTableRows(table_id)    
        } catch (error) {
            throw error    
        }
        
    }
    
   
}


