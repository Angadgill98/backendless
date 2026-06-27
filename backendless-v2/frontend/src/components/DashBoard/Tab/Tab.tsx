import React, { useEffect } from 'react'
import type { tab } from '../Dashboard'

const Tab = (props:{tabs:tab[],activeTab:tab|null,setActiveTab:React.Dispatch<React.SetStateAction<tab|null>>}) => {
  useEffect(() => {
    console.log(props.tabs)
  }, [props.tabs])
  
  return (
    <>
      <ul style={{display:"flex",flexDirection:"row",gap:"10px"}}>
        {props.tabs.map((value,index)=>{
          return(
            <li key={value.table_id} data-name={value.tab_name} onClick={()=>props.setActiveTab({table_id:value.table_id,tab_name:value.tab_name})}>
              {value.tab_name}
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default Tab