import React, { useEffect } from 'react'
import type { tab } from '../Dashboard'
import Options from './Options'


const Table = (props:{activeTab:tab | null}) => {
  useEffect(() => {
    if(props.activeTab!=null){
      let temp=async()=>{
        let tables= await GetTableData(props.activeTab!.table_id)
      }


      temp()
    }
  }, [props.activeTab])
  
  return (
    <div style={{width:"100%",height:"100%"}}>
        <div style={{width:"100%",height:"4%"}}>
            <Options/>
        </div>
            
        
        
        
    </div>
  )
}

export default Table


async function GetTableData(table_id:string){
  try {
    let res=await fetch(`${import.meta.env.VITE_API_URL}/api/get-table-data`,{
      method:"POST",
      headers:{
        "Content-Type": "application/json",
      },
      body:JSON.stringify({table_id}),
      credentials:"include"

    })
    let data=await res.json()

    if(!res.ok){
      console.log(data)
      console.log("error while fetching data")
      return 
    }

    console.log(data)
    console.log("table_data fetched")
    return
  } catch (error) {
    console.log(error)
    return
  }
}


type table={
  column_name:string
  
}