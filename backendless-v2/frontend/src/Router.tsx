import React from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import Dashboard from "./components/DashBoard/Dashboard";

const Router = () => {

    
    
    return (
        <Routes>
            <Route path="/" element={<App/>}></Route>
            <Route path="/dashboard" element={<Dashboard/>}></Route>
        </Routes>
    )
};

export default Router;
