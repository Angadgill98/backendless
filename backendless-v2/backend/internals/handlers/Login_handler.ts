import type { RequestHandler } from "express"
import { CreateLoginServices } from "../services/login.js"
import type { LoginServices } from "../services/login.js"
import type { Pool } from "pg"
import { ConsoleLogger, CreateFileLogger } from "../../logger.js"
import { AccessToken as AccessToken, RefreshToken as RefreshToken } from "../middleware/jwt.js"
import { Utils } from "../utils/utils.js"
import { AppError } from "../../error/error.js"
export function CreateLoginHandler(db: Pool) {
    return new LoginHandler(db)
}


class LoginHandler {
    services: LoginServices
    logger = CreateFileLogger("login.log")
    consolelogger = ConsoleLogger(true)
    utils = new Utils()
    constructor(db: Pool) {
        this.services = CreateLoginServices(db)

    }
    SignUp: RequestHandler = async (req, res) => { 
        try {
            let body: userinfo = req.body
            //validation/dafety checks to be implemented like isempty

            await this.services.Singup(body.user_name, body.email, body.pass_word)
            this.utils.SendResponse(200, "success", true, res, {username:body.user_name,email:body.email})
        } catch (error) {
            if(error instanceof AppError){
                this.consolelogger.error("",error)
                this.utils.SendResponse(400,"failed",false,res,{})
            }
            this.consolelogger.error("",error)
            this.utils.SendResponse(500, "failed", false, res, {})
        }

    }

    Signin: RequestHandler = async (req, res) => {
        try {
            let body: userinfo = req.body
            //validation/dafety checks to be implemented like isempty

            const { userid, email } = await this.services.Singin(body.user_name, body.email, body.pass_word)
            let token = AccessToken({ userid, email })
            let refreshToken = RefreshToken({ userid, email })
            res.cookie("access_token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            })
            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            })
            this.utils.SendResponse(200, "success", true, res, {access_token:token})
        } catch (error) {
            if (error instanceof AppError){
                this.consolelogger.error(error)
                this.utils.SendResponse(error.code,"failed",false,res,{})
            }
            //this.consolelogger.error("",error)
            this.utils.SendResponse(500, "failed", false, res, {})
        }

    } 
    ProxySignin: RequestHandler = async (req, res) => {
        try {
            let body: userinfo = req.body
            //validation/dafety checks to be implemented like isempty

            const { userid, email,proxy_info } = await this.services.ProxySignIn(body.user_name, body.email, body.pass_word)
            let token = AccessToken({ userid, email })
            let refreshToken = RefreshToken({ userid, email })
            res.cookie("access_token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            })
            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            })
            this.utils.SendResponse(200, "success", true, res, {access_token:token,proxy_info,userid})
        } catch (error) {
            if (error instanceof AppError){
                this.consolelogger.error("",error)
                this.utils.SendResponse(400,"failed",false,res,{})
            }
            this.consolelogger.error("",error)
            this.utils.SendResponse(500, "failed", false, res, {})
        }

    } 

}
type userinfo = {
    user_name: string,
    pass_word: string,
    email: string
}