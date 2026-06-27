import React, { useEffect, useRef, useState, type HTMLInputTypeAttribute } from 'react'
import { data } from 'react-router-dom'
import type { tab } from '../Dashboard'

const Sidebar = (props:{tabs:tab[],setActiveTabs:React.Dispatch<React.SetStateAction<tab[]>>,setActiveTab:React.Dispatch<React.SetStateAction<tab|null>>}) => {
    let [table_list,set_table_list]=useState<table[]>([])
    useEffect(() => {
        let load_tables=async ()=>{
            let tables=await GetTables()
            console.log(tables)
            set_table_list(tables)
        }
        load_tables()
    }, [])
    
    
    let table=useRef<HTMLInputElement | null>(null)
    let [isAddtable,set]=useState(false)
    
    
    
    let add_table=()=>{
        if (table==null) return
        if (isAddtable) return
        set(true)

        let temp= async()=> {
            let table_id=await AddTable(table.current!.value)
            if( typeof table_id ==="string") set_table_list([...table_list,{table_id,table_name:table.current!.value}])
            
        }
        temp()
        
        set(false)
    }
  return (
    <>
        <div>

        
        <div>
            <input type='text' placeholder='Add a table' ref={table}></input>
            <button onClick={()=>{add_table()}}>Add</button>
        </div>


        <ul>
            {table_list.length >0 && table_list.map((value,index)=>{
                return(
                   
                        <li onClick={()=>{OpenTab(value.table_id,value.table_name,props.setActiveTabs,props.tabs,props.setActiveTab)}} key={value.table_id} id={value.table_id}>{value.table_name}</li>
                   
                )
            })}
        </ul>
        </div>
    </>
  )
}

export default Sidebar


async function AddTable(table:string):Promise<string|null>{
    try {
        let res=await fetch(`${import.meta.env.VITE_API_URL}/api/create-tables`,{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify({table_name:table}),
            credentials:"include"
        })

        let data=await res.json()

        if (!res.ok){
            console.log(data)
            console.log("failed to cretea table")
            return null

        }
        console.log(data)
        console.log("creted a table")

        return data.data.table_id
    } catch (error) {
        console.log("not able to add table")
        return null
    }
}

async function GetTables() :Promise<table[]> {
    try {
        let res=await fetch(`${import.meta.env.VITE_API_URL}/api/get-tables`,{
            method:"GET",
            headers:{
                "Content-Type": "application/json",
            },
            credentials:"include"
        })

        let data=await res.json()

        if (!res.ok){
            console.log(data)
            console.log("failed to get tables")

        }
        console.log(data)
        console.log("got the table")
        return data.data.tables

    } catch (error) {
        
        console.log("failed to store tables",error)
        return []
    }
}


type table={
    table_id:string
    table_name:string
}








function OpenTab(
    table_id: string,
    table_name: string,
    setActiveTabs: React.Dispatch<React.SetStateAction<tab[]>>,
    tabs: tab[],
    setActiveTab: React.Dispatch<React.SetStateAction<tab | null>>
) {
    const exists = tabs.some(
        (t) => t.table_id === table_id
    );

    if (!exists) {
        setActiveTabs([
            ...tabs,
            {
                tab_name: table_name,
                table_id,
            },
        ]);
    }

    setActiveTab({
        tab_name: table_name,
        table_id,
    });
}
