import React, { useEffect, useState } from 'react'
import type { tab } from '../Dashboard'
import Options from './Options'
import "./table.css"

const Table = (props:{activeTab:tab | null}) => {
  let [is_table_data,set_is_data]=useState(false)
  let [table_data,setdata]=useState<row[]>([])
  let [columns,setcolumns]=useState()

  

  useEffect(() => {
    if(props.activeTab!=null){
      let temp=async()=>{
        let table_data= await GetTableData(props.activeTab!.table_id)
        
        if (table_data.length!=0){
          set_is_data(true)
          setdata(table_data)
        }else{
          set_is_data(false)
          setdata([])
        }

      }


      temp()
    }
  }, [props.activeTab])
  
  return (
    <>
      {props.activeTab ?<div style={{width:"100%",height:"100%"}}>
      
        <div style={{width:"100%",height:"3.4%"}}>
            <Options activeTab={props.activeTab}/>
        </div>

        <table className='table-table'>
          <thead>
           
              <ShowColumns columns={props.activeTab.columns}/>
            
          </thead>


          <tbody>
            {is_table_data && <ShowData rows={table_data}/> }
            
          </tbody>
        </table> 
        
        
        <div>
        
        </div>
        
        
        
    </div> : <></>}
    </>
    
  )
}

export default Table


async function GetTableData(table_id:string):Promise<row[]>{
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
      return []
    }

    console.log(data.data.rows)
    console.log("table_data fetched")
    return data.data.rows
  } catch (error) {
    console.log(error)
    return []
  }
}

function ShowColumns(props: { columns:object }) {
 
    const entries = Object.entries(props.columns);

    return (
        <tr>
          <td id='table-cell'>id</td>
          <td id='table-cell'>user identifier</td>
            {entries.map(([key, value]) => (
                <td id='table-cell' key={key} data-type={value.type}> {key}</td>
            ))}
        </tr>
    );
}

function ShowData(props:{rows:row[]}){

  

  return(<>
    {props.rows.map((value,index)=>{
      value.data
      return(
        <>
        <tr>
        <td id='table-cell'>{value.id}</td>
        <td id='table-cell'>{value.tenant_user_identifier}</td>
        {Object.entries(value.data).map(([key, data]) => (
          <td id='table-cell' key={key}>{String(data)}</td>
        ))}
        </tr>
        </>
      )
    })}

  </>)
}

type row={
  data:any
  id:number
  tenant_user_identifier:string
}
