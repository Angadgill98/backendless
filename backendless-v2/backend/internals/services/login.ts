import { LoginRepo } from "../repo/Login_repo.js"
import { CreateLoginRepo } from "../repo/Login_repo.js"
import { HashPassword } from "../../bcrypt.js"
import type { Pool } from "pg"
import type winston from "winston"
import { ConsoleLogger, CreateFileLogger } from "../../logger.js"
import { Utils } from "../utils/utils.js"
import type { UUID } from "node:crypto"
import { AppError } from "../../error/error.js"


export function CreateLoginServices(db: Pool): LoginServices {
    return new LoginServices(db)
}
export class LoginServices {
    login_repo: LoginRepo
    logger = CreateFileLogger("login.log")
    consolelogger = ConsoleLogger(true)
    utils=new Utils()
    constructor(db: Pool) {
        this.login_repo = CreateLoginRepo(db)

    }
    async Singup(username: string, email: string, password: string) {
        try {
            let hashed_pass: string = await HashPassword(password)
            this.login_repo.InsertUser(username, email, hashed_pass)
        } catch (error) {
            if (error instanceof AppError){
                throw error
            }
            throw new Error("failed to singup ",{cause:error})
        }
        
    }
    async Singin(username: string, email: string, password: string) : Promise<{ userid: string; email: string }>  {
        try {
            
            this.consolelogger.info("sign in data:",{username,email,password})
            let userid:string=await this.login_repo.VerifyCredentials(username, email, password)
            

            return {userid,email}
        } catch (error) {
            if (error instanceof AppError){
                throw error
            }
            throw new Error("failed to signin",{cause:error})
          
        }

    }
    async ProxySignIn(username: string, email: string, password: string) : Promise<{ userid: string; email: string,proxy_info:any[] }>  {
        try {
            
            this.consolelogger.info("sign in data:",{username,email,password})
            let userid:UUID=await this.login_repo.VerifyCredentials(username, email, password)
            let proxy_info:any=await this.login_repo.ProxyLogin(userid)

            return {userid,email,proxy_info}
        } catch (error) {
            if (error instanceof AppError){
                throw error
            }
            throw new Error("failed to proxy signin",{cause:error})
        }

    }
}