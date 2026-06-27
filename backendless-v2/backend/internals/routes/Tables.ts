import type { Router } from "express";
import { CreateTableHandler, Tablehandler } from "../handlers/Table_handler.js";
import type { Pool } from "pg";
import type { RedisClientType } from "redis";



export function SetupTableRoutes(router:Router,db:Pool,rdb:RedisClientType){
    let tablehandler=CreateTableHandler(db,rdb)
    router.post("/create-tables",tablehandler.CreateTable)
    router.get("/get-tables",tablehandler.FIndUserTables)
    router.post("/create-columns",tablehandler.CreateColumns)
    router.put("/update-columns",tablehandler.UpdateColumnSchema)
    router.post("/get-table-data",tablehandler.GetTableData)
    console.log("tables routes set up complete")
}