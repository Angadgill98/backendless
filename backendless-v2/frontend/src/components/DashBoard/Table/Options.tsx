import React, { useRef, useState } from 'react'
import "./options.css"
import type { tab } from '../Dashboard';
const Options = (props:{activeTab:tab,setactiveTab:React.Dispatch<React.SetStateAction<tab | null>>}) => {
    let [modal,setmodal]=useState(false);
    

    return (
    <div className='options-contianer'>
        <button id='options-create-column' onClick={()=>{setmodal(prev=>!prev)}}>Create Columns </button>
        {modal && <Modal aciivetab={props.activeTab} setactiveTab={props.setactiveTab} setmodal={setmodal} />}
    </div>
  )
}

export default Options

function Modal(props:{setmodal:React.Dispatch<React.SetStateAction<boolean>>,aciivetab:tab,setactiveTab:React.Dispatch<React.SetStateAction<tab | null>>}){
    let [isadd,setadd]=useState(false)
    let [type,settype]=useState("int")
    let column_name=useRef<HTMLInputElement>(null);
    let ColumnVali=()=>{
        if (isadd) return
        setadd(true)
        if (!column_name.current?.value.trim()) return

        CreateColumn(type,column_name.current?.value,props.aciivetab.table_id,props.aciivetab?.tab_name,props.setactiveTab,props.aciivetab)

        setadd(false)
        props.setmodal(false)
    }

    return(
        <div className='modal-backdrop' onClick={()=>{props.setmodal(prev=>!prev)}}>
            
            <div className='modal' onClick={(e) => e.stopPropagation()}>
                <input ref={column_name} type='text' placeholder='Enter the anme fo the columns'></input>
                
                <p>Select a type</p>
                <select value={type} onChange={(e)=>{settype(e.target.value)}}>
                    <option value="int">Integer</option>
                    <option value="string">String</option>
                    <option value="boolean">Boolean</option>
                    <option value="date">Date</option>
                </select>

                
                
                
                
                <button onClick={()=>{ColumnVali()}}>add</button>
            </div>
            

        </div>
    )
}


async function CreateColumn(type:string,column_name:string,table_id:string,table_name:string,setactiveTab:React.Dispatch<React.SetStateAction<tab | null>>,
    activeTab:tab
){
    try {
        let res=await fetch(`${import.meta.env.VITE_API_URL}/api/create-columns`,{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
            },
            credentials:"include",
            body:JSON.stringify({
                table_id,
                table_name,
                columns:[
                    {
                        [column_name]:{
                            type
                        }
                    }
                ]
            })
        })
        let data=await res.json()

        if (!res.ok){
            console.log("failed to create the column")
            console.log(data)
            
        }else{
            console.log("created the column")
            console.log(data)
            setactiveTab(prev => {
                if (!prev) return prev;

                return {
                    ...prev,
                    columns: {
                        ...prev.columns,
                        [column_name]: {
                            type: type
                        }
                    }
                };
            });
        }

    } catch (error) {
        console.log("error occured while creating column; ",error)

    }
}
