import React, { useEffect } from 'react'
import type { tab } from '../Dashboard'

import "./Tab.css"

const Tab = (props:{tabs:tab[],activeTab:tab|null,setActiveTab:React.Dispatch<React.SetStateAction<tab|null>>,setActiveTabs: React.Dispatch<React.SetStateAction<tab[]>>}) => {
  useEffect(() => {
    console.log(props.tabs)
  }, [props.tabs])
  
  return (
    <>
      <ul className='tab-list' style={{display:"flex",flexDirection:"row"}}>
        {props.tabs.map((value,index)=>{
          return(
            
            <li id='tab-list-item' key={value.table_id} data-name={value.tab_name} onClick={()=>props.setActiveTab({table_id:value.table_id,tab_name:value.tab_name,columns:value.columns})}>
              {value.tab_name}
              <button onClick={(e)=>{e.stopPropagation();CloseTab(props.tabs,props.setActiveTab,props.setActiveTabs,value)}}>x</button>
            </li>

            
          )
        })}
      </ul>
    </>
  )
}

export default Tab


function CloseTab(
    tabs: tab[],
    setActiveTab: React.Dispatch<React.SetStateAction<tab | null>>,
    setActiveTabs: React.Dispatch<React.SetStateAction<tab[]>>,
    tabToClose: tab
) {
    const index = tabs.findIndex(
        (t) => t.table_id === tabToClose.table_id
    );

    const newTabs = tabs.filter(
        (t) => t.table_id !== tabToClose.table_id
    );

    setActiveTabs(newTabs);

    if (newTabs.length === 0) {
        setActiveTab(null);
        return;
    }

    const nextIndex = Math.max(0, index - 1);
    setActiveTab(newTabs[nextIndex]);
}