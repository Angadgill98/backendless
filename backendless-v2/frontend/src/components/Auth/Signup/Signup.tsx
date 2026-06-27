import React, { useRef, useState } from 'react'

import "./Signup.css"

const Signup = () => {

    let name=useRef<HTMLInputElement>(null)
    let mail=useRef<HTMLInputElement>(null)
    let pass=useRef<HTMLInputElement>(null)

    let [isSignup,set]=useState(false)

    let OnSignUP=()=>{
        if (isSignup) return
        set(true)
        //input hadnling to be done  
        if (name ==null ||pass ==null || mail ==null ){
            return
        }

        console.log(name.current!.value,pass.current!.value,mail.current!.value)
        TenantSignUp(name.current!.value,pass.current!.value,mail.current!.value)

        set(false)
    }

  return (
    <>
    <div className='sign-up-container'>
        <h3 className='sign-up-heading'>Signup</h3>

        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            <input ref={name}  type='text' placeholder='Enter name'></input>

            <input ref={mail} type='text' placeholder='Enter Email'></input>

            <input ref={pass} type='password' placeholder='Enter Password'></input>
        </div>

        <button onClick={OnSignUP} >Signup</button>

        {/* for rotuing to sigin link */}


    </div>
    </>
  )
}

export default Signup

async function TenantSignUp(name :string,pass:string,mail:string){
    try {
        let res=await fetch(`${import.meta.env.VITE_API_URL}/signup`,{
        method:"POST",
        headers: {
            "Content-Type": "application/json",
        },
        body:JSON.stringify({
            user_name:name,
            pass_word:pass,
            email:mail
        })
    })

    let data= await res.json()

    if (!res.ok){
        console.log("Failed to Signup")
        console.log(data)
    }

    console.log("Signup Success")
    

    //redirect or route to singup or profile
    } catch (error) {
        
    } 

}
