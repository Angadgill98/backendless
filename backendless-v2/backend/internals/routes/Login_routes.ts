import type { Express } from "express";
import { CreateLoginHandler as CreateLoginHandler } from "../handlers/Login_handler.js";
import type { Pool } from "pg";
import type winston from "winston";

export function SetupLoginRoutes(app:Express,db:Pool){
    const handler=CreateLoginHandler(db)
    app.post("/signup",handler.SignUp)
    app.post("/signin",handler.Signin)
    app.post("/proxy-signin",handler.ProxySignin)
    console.log("login routes set up complete")
}