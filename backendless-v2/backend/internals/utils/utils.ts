import type { Response } from "express";

import type { QueryResult } from "pg";
import { ConsoleLogger } from "../../logger.js";

import type { ColumnScehma, InsertStruct, WhereStruct } from "../models.js";
import { format } from "util";
import { AppError } from "../../error/error.js";




export class Utils {
    consolelogger = ConsoleLogger(true)


    RowsChecker (rows: QueryResult<any>, msg: string,cause:string,code:number) {
        //insert and update and delete
        if (rows?.rows?.length==0) {
            throw new AppError(msg,cause,code);
        }

    }
    RowscountChecker(rows: QueryResult<any>, msg: string,cause:string,code:number) {
        if (rows?.rowCount==0) {
            throw new Error(msg);
        }
    }


    SendResponse(code: number, status: string, msg: boolean, res: Response, metadata: any) {
        return res.status(code).json({
            status,
            msg: msg,
            data: metadata
        })
    }



    SerializeError(err: any) {

    const obj: any = {};

    Object.getOwnPropertyNames(err).forEach((key) => {
        obj[key] = err[key];
    });

    return obj;
    }
    RemoveLastLetter(str: string): string {
        return str.slice(0, -1);
    }

    
    InsertQueryBuilder(query:string,arr:InsertStruct[]) :string{
        let values:string
        query=query.trim()
        query=query+"("
        for (const value of arr){
            query=this.InsertColumnsBuilder(query,value.column_name)
        }
        query=this.RemoveLastLetter(query)
        query=query+")"
        query=query+" values ("
        for (let i = 0; i < arr.length; i++) {
            query=this.InsertValuesBuilder(query,i+1)
        }
        //same justwith entries (for knwolegde)
        // for (const [index,value] of arr.entries()){
        //     query=this.InsertValuesBuilder(query,index+1)
        // }
        query=this.RemoveLastLetter(query)
        return query+")"

    }
    GetValues(arr: InsertStruct[]) {
        let values:any[]=[]
        for (let i = 0; i < arr.length; i++) {
            values.push(arr[i]?.value)
        }
        return values
    }

    InsertColumnsBuilder(query:string,column_name: string){
        return format(query+` ${column_name},`)
    }
    InsertValuesBuilder(query:string,column_no: number){
        return format(query+` $${column_no},`)
    }



    UpdateSetQueryBUilder(query:string,arr:InsertStruct[]){
        try {
            query=query.trim()
            let counter=0
            for(const value of arr){
                counter++
                query=format(query+` ${value.column_name}=$${counter},`)
                
            }
            query=this.RemoveLastLetter(query)
            return {query,counter}
        } catch (error) {
            throw error    
        }
    }
    UpdateWhereQueryBuilder(query:string,arr:WhereStruct[],counter:number){
        try {
            query=query.trim()
            
            for(const v of arr){
                counter++
                query=format(query+` ${v.value}=$${counter} and`)
            }
            query=this.RemoveLastLetter(query)
            query=this.RemoveLastLetter(query)
            query=this.RemoveLastLetter(query)
            return query
        } catch (error) {
            throw error
        }
    }


    BuildJsonbUpateQuery(query:string, arr:InsertStruct[]) {
        try {
            query=query.trim()
            let counter=0
            for(const value of arr){
                counter++
                query=format(query+` ${value.column_name}=${value.column_name}||$${counter}::jsonb,`)
                
            }
            query=this.RemoveLastLetter(query)
            return {query,counter}
        } catch (error) {
            throw error    
        }
    }
    ConvertColumnsArrayToObject(columns: any[]) {
    const result: Record<string, any> = {};

    for (const item of columns) {
        const key = Object.keys(item)[0]; // "test-column"
        if (key){
            result[key] = item[key];
        }
        
    }

    return result;
    }


    // FlattenSchema(schema: Record<string, ColumnScehma>, prefix = "", result:Record<string, string>) {
    //     // let keys:string[]=[]
    //     // let types:string[]=[]
    //     // let flattenSchema:FlattenSchema[]=[]
    //     let flattenSchema:Record<string,string>={}
    //     for (const [key, value] of Object.entries(schema)) {

    //         const fullKey = prefix ? `${prefix}.${key}` : key;

    //         // if it's a leaf node (has type)
    //         if (value && typeof value === "object" && value.type) {
    //             //result.set(fullKey, value.type);
    //             // flattenSchema.push({
    //             //     types:value.type,
    //             //     keys:fullKey
    //             // })
    //             flattenSchema[fullKey]=value.type
    //         }
            
    //         // still check if it has nested objects (don’t block this)
            
    //         // if (value[key] && typeof value[key] === "object") {
    //         //     this.FlattenSchema(value[key], `${fullKey}.${key}`, result);
    //         // }
    //         if (value && typeof value === "object") {
    //             this.FlattenSchema(value as Record<string, ColumnScehma>, `${fullKey}.${key}`,flattenSchema)
    //         }
    //     }
    //     //return result;
    //     return flattenSchema
    // }
    FlattenSchema(schema: Record<string, any>, prefix = "", flattenSchema:Record<string, string>={}) {
        
      
        for (const [key, value] of Object.entries(schema)) {

            const fullKey = prefix ? `${prefix}.${key}` : key;

            if (value !== null && typeof value === "object" && !Array.isArray(value)) {
                
                this.FlattenSchema(value, fullKey, flattenSchema);
            }else {
                
                flattenSchema[fullKey] = String(value);
            }

            
        }
        
        return flattenSchema
    }
}

