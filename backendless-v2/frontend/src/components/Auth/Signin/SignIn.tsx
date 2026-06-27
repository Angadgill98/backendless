import React, { useRef, useState } from "react";

import "./Signin.css";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
    let navigate=useNavigate()

  let name = useRef<HTMLInputElement>(null);
  let mail = useRef<HTMLInputElement>(null);
  let pass = useRef<HTMLInputElement>(null);

  let [isSignin, set] = useState(false);

  let OnSignin = () => {
    if (isSignin) return;
    set(true);
    //input hadnling to be done
    if (name == null || pass == null || mail == null) {
        
      return;
    }
    console.log("asdsad")
    let temp=async ()=>{
        
        let ok= await TenantSignIn(name.current!.value, pass.current!.value, mail.current!.value);
        set(false);
        console.log("asdsad")
        if(ok)navigate("/dashboard")
    }
    temp()
 console.log("asdsad")
    
    
  };

  return (
    <>
      <div className="sign-in-container">
        <h3 className="sign-in-heading">SignIn</h3>

        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          <input ref={name} type="text" placeholder="Enter name"></input>

          <input ref={mail} type="text" placeholder="Enter Email"></input>

          <input
            ref={pass}
            type="password"
            placeholder="Enter Password"
          ></input>
        </div>

        <button onClick={OnSignin}>SignIn</button>

        {/* for rotuing to sigin link */}
      </div>
    </>
  );
};

export default SignIn;

async function TenantSignIn(name: string, pass: string, mail: string):Promise<boolean> {
  try {
    let res = await fetch(`${import.meta.env.VITE_API_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name:name,
            pass_word:pass,
            email:mail
      }),
      credentials:"include"
    });

    let data = await res.json();

    if (!res.ok) {
      console.log("Failed to Signup");
      console.log(data);
      return false
    }
    
    console.log(data);
    console.log("Signin Success");

    //redirect or route to singup or profile
    return true
} catch (error) {
    console.log(error)
    return false
}
}
