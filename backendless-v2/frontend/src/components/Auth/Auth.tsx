import React, { useState } from 'react'
import SignIn from './Signin/SignIn'
import Signup from './Signup/Signup'

import "./Auth.css"
const Auth = () => {
    let [step,setstep]=useState<boolean>(true)
  return (
    <>
        <div className='auth-container'>
            <div className='auth-sign_up_in'>
                {step ? <SignIn/> : <Signup/>}
            </div>
            {step ? <button onClick={()=>{setstep(false)}}>Sign Up?</button> :<button onClick={()=>{setstep(true)}}>SIgn in?</button>}
        </div>
    </>
  )
}

export default Auth