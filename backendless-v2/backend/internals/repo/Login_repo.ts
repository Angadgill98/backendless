import type { Pool, QueryResult } from "pg"
import { ConsoleLogger, CreateFileLogger } from "../../logger.js"
import { Utils } from "../utils/utils.js"
import bcrypt from "bcrypt";
import type { UUID } from "node:crypto";
import { AppError, InsertUserError, ProxyLoginError, VerifyCredentialsError } from "../../error/error.js";
export function CreateLoginRepo(db: Pool) {
    return new LoginRepo(db)
}

export class LoginRepo {
    db: Pool
    logger = CreateFileLogger("login.log")
    consolelogger = ConsoleLogger(true)
    utils = new Utils()
    constructor(db: Pool) {
        this.db = db
    }
    async ProxyLogin(user_id:UUID) {
        try {
           let query=`Select table_name,table_id,columns from users_tables where
           user_id=$1
           `
           let result = await this.db.query(query, [user_id])

          
            if(result.rows.length==0){
                throw new ProxyLoginError("no tables found for user","ProxyLogin",401)
            }

           return result.rows

        } catch (error) {

            if (error instanceof AppError){
                throw error
            }
            throw new Error("error while proxylogin ",{cause:error})
            
        }


    }
    async VerifyCredentials(user_name: string, email: string, password: string) {
        try {
            let query = `SELECT user_id,pass_word from users where 
            user_name=$1 and
            email=$2 and
            
            is_active=true
            `
            let rows = await this.db.query(query, [user_name, email])

            
            if(rows.rowCount==0){
                throw new VerifyCredentialsError("failed no user exist","VerifyingCredentials",401)
            }

            const isMatch = await bcrypt.compare(password, rows.rows[0].pass_word);

            if (!isMatch) {
                throw new VerifyCredentialsError("worng password","VerifyingCredentials",401)
            }
            return rows.rows[0].user_id
        } catch (error) {
        
            if (error instanceof AppError){
                throw error
            }

            throw new Error("error while verifying the user:",{cause:error})
            
        }


    }
    async InsertUser(user_name: string, email: string, password: string) {
        try {
            let query = `insert into users (user_name,email,pass_word) values
            ($1,$2,$3) 
            `
            let rows_count = await this.db.query(query, [user_name, email, password])
            
            if(rows_count.rowCount==0){
                throw new InsertUserError("falied to insert user","InsertUser",401)
            }
            return rows_count
        } catch (error){
           
            if (error instanceof AppError){
                throw error
            }
            throw new Error("error while inserting the user ",{cause:error})
            
        }

    }
}