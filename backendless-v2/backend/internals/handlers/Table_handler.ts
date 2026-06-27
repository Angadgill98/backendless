import type { Pool } from "pg"
import { ConsoleLogger, CreateFileLogger } from "../../logger.js"
import { TableServices } from "../services/table.js"
import { Utils } from "../utils/utils.js"
import type { RequestHandler } from "express"
import type { RedisClientType } from "redis"
import { AppError } from "../../error/error.js"


export function CreateTableHandler(db: Pool,rdb:RedisClientType) {
    return new Tablehandler(db,rdb)
}

export class Tablehandler {
    services: TableServices
    logger = CreateFileLogger("table.log")
    consolelogger = ConsoleLogger(true)
    utils = new Utils()
    constructor(db: Pool,rdb:RedisClientType) {
        this.services = new TableServices(db,rdb)

    }

    CreateTable:RequestHandler=async (req,res)=>{
        
        let userid=req.user?.userid
        try {
            
            //add string validation

           
            let table_id=await this.services.CreateTable(userid,req.body.table_name)
            this.utils.SendResponse(200,"success",true,res,{table_id})
        } catch (error) {
            if(error instanceof AppError){
                
            }

            this.consolelogger.error("failed to create a table",{body:
                {userid,table_name:req.body.table_name},
                error
            })
            this.utils.SendResponse(400,"failed",false,res,{})
        }
    }
    FIndUserTables:RequestHandler=async(req,res)=>{
        let userid=req.user?.userid
        try {
            
            //add string validation

           
            let data=await this.services.FindUserTables(userid)
            this.utils.SendResponse(200,"success",true,res,{tables:data})
        } catch (error) {
            if(error instanceof AppError){
                
            }
            this.consolelogger.error("failed to find table",{body:
                {userid},
                error
            })
            this.utils.SendResponse(400,"failed",false,res,{})
        }
    }
    CreateColumns:RequestHandler=async(req,res)=>{
        let userid=req.user?.userid
        try {
            let table_id=req.body.table_id
            let table_name=req.body.table_name
            let columns:any[]=req.body.columns
            
            //add string validation
            
            
            await this.services.CreateColumns(userid,table_name,table_id,columns)
            this.utils.SendResponse(200,"success",true,res,{})
        } catch (error) {
            if(error instanceof AppError){
                
            }
            this.consolelogger.error("failed to create columns ",{body:
                {userid},
                error
            })
            this.utils.SendResponse(400,"failed",false,res,{})
        }
    }

    UpdateColumnSchema:RequestHandler=async(req,res)=>{
        let userid=req.user?.userid
        try {
            
            let table_id=req.body.table_id
            let table_name=req.body.table_name
            let columns:any[]=req.body.columns
             
            //add string validation
            this.services.UpdateSchema(userid,table_name,table_id,columns)
            this.utils.SendResponse(200,"success",true,res,{})
        } catch (error) {
            if(error instanceof AppError){
                
            }
            this.consolelogger.error("failed to create columns ",{body:
               req.body,
                error
            })
            this.utils.SendResponse(400,"failed",false,res,{})
        }
    }

    GetTableData:RequestHandler=async(req,res)=>{
        try {
            let tenant_id=req.user.userid
            let table_id=req.body.table_id

            let rows=await this.services.GetTableData(tenant_id,table_id)
            this.utils.SendResponse(200,"success",true,res,{rows})
        } catch (error) {
            if(error instanceof AppError){
                
            }
            this.consolelogger.error("failed to get table data ",{body:
               req.body,
                error
            })
            this.utils.SendResponse(400,"failed",false,res,{})
        }
    }
    
}