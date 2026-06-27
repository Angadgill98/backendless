import express, { Router } from 'express'

const app = express()
app.use(express.json());
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000


import { CreateFileLogger as CreateFileLogger } from "./logger.js"
import { SetupLoginRoutes } from './internals/routes/Login_routes.js';
import { SetupPostgresDB } from './db.js';
import type { Pool } from 'pg';
import { authMiddleware } from './internals/middleware/jwt.js';
import { SetupTableRoutes } from './internals/routes/Tables.js';
import { ConnectToRedis } from './redis.js';
import type { RedisClientType } from 'redis';


import cors from "cors";
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

import cookieParser from 'cookie-parser';
app.use(cookieParser())

async function Init() {

    try {
        let db = await SetupDB()
        let redis=await ConnectToRedis()
        let ApiRouter = SetupRoutes(db,redis)
        app.use("/api", ApiRouter)
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (error) {
        console.error(error)
    }

}

Init()


function SetupRoutes(db: Pool,rdb:RedisClientType) {
    const ApiRouter = Router();
    ApiRouter.use(authMiddleware)
    SetupLoginRoutes(app, db)
    SetupTableRoutes(ApiRouter,db,rdb)
    return ApiRouter
}
 
async function SetupDB() {

    try {
        let pool = SetupPostgresDB()
        await pool.query("SELECT 1"); // test connection
        console.log("DB connected successfully");
        return pool;

    } catch (err) {
        console.error("DB connection failed");
        throw err; // let caller decide what to do
    }
}

