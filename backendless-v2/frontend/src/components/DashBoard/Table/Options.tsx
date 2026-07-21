import React, { useRef, useState } from 'react'
import "./options.css"
const Options = () => {
    let [modal,setmodal]=useState(false);
    

    return (
    <div className='options-contianer'>
        <button onClick={()=>{setmodal(prev=>!prev)}}>Create Columns </button>
        {modal && <Modal setmodal={setmodal} />}
    </div>
  )
}

export default Options

function Modal(props:{setmodal:React.Dispatch<React.SetStateAction<boolean>>}){
    let [isadd,setadd]=useState(false)
    let [type,settype]=useState("int")
    let column_name=useRef<HTMLInputElement>(null);
    let ColumnVali=()=>{
        if (isadd) return
        setadd(true)
        if (!column_name.current?.value.trim()) return

        CreateColumn(type,column_name.current?.value)

        setadd(false)
    }

    return(
        <div className='modal-backdrop' onClick={()=>{props.setmodal(prev=>!prev)}}>
            
            <div className='modal'>
                <input ref={column_name} type='text' placeholder='Enter the anme fo the columns'></input>
                
                <p>Select a type</p>
                <select value={"int"} onChange={(e)=>{settype(e.target.value)}}>
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


async function CreateColumn(type:string,column_name:string){
    try {
        let res=await fetch(`${import.meta.env.VITE_API_URL}/create-columns/api`,{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
            },
            credentials:"include",
            body:JSON.stringify({})
        })
        let data=await res.json()

        if (!res.ok){
            console.log("failed to create the column")
            console.log(data)
        }else{
            console.log("created the column")
            console.log(data)
        }

    } catch (error) {
        console.log("error occured while creating column; ",error)
        
    }
}
