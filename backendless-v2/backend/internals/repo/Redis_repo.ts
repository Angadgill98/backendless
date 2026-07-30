import type { UUID } from "node:crypto";
import type { RedisClientType } from "redis";

import { ConsoleLogger, CreateFileLogger } from "../../logger.js";
import { table } from "node:console";




export function CreateRedisRepo(redis:RedisClientType):Redis_repo{
    return new Redis_repo(redis)
}

export class Redis_repo{
    rdb:RedisClientType
    consoleLogger=ConsoleLogger(true)
    fileLogger=CreateFileLogger("redis")
    constructor(rdb:RedisClientType){
        this.rdb=rdb
    }


    async SetFlattenSchema(tenant_id:UUID,table_name:string,FlattenSchema:Record<string,string>){
        try {
             //await this.rdb.mSet(FlattenSchema)

            const key = `schema:tenant_id:${tenant_id}:table_name:${table_name}`;

            await this.rdb.del(key);

            await this.rdb.hSet(key, FlattenSchema);
        } catch (error) {
            this.consoleLogger.error("failed to set data in redis ",{tenant_id,table_name,FlattenSchema,error})
            throw error
        }
       
    }

    async GetFlatenSchema(tenant_id:UUID,table_name:string):Promise<Map<String,String>>{
        try {
            // let types=await this.rdb.hmGet("tenant_id:"+tenant_id+":"+"table_name:"+table_name,column)
            // let result: Map<string, string | null|undefined> = {};

            // for (let i = 0; i < column.length; i++) {
            //     result[column[i]!] = types[i];
            // }

            // return result;

            let schema= new Map(
                Object.entries(await this.rdb.hGetAll("schema:tenant_id:"+tenant_id+":"+"table_name:"+table_name))
            )
            return schema


        } catch (error) {
            this.consoleLogger.info("no schem found in the redis")
            return new Map();
        }
    }

    async UpdateFlattenSchema(tenant_id:UUID,table_name:string,FlattenSchema:Record<string,string>){
        try {
          

            const key = `schema:tenant_id:${tenant_id}:table_name:${table_name}`;

            await this.rdb.del(key);

            await this.rdb.hSet(key, FlattenSchema);        
        } catch (error) {
            throw error
        }
       
    }


    async IsExist(tenant_id:UUID,table_name:string):Promise<number>{
        const key = `schema:tenant_id:${tenant_id}:table_name:${table_name}`;
        return await this.rdb.exists(key);

    }
}