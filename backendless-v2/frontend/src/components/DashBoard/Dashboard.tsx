import React, { useState } from "react";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./SideBar/Sidebar";

import "./Dashboard.css";
import Table from "./Table/Table";
import Tab from "./Tab/Tab";
const Dashboard = () => {
  let [tabs,setActiveTabs]=useState<tab[]>([])

  let [activeTab,setActiveTab]=useState<tab|null>(null)
  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-navbar">
          <Navbar />
        </div>

        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "row",
            backgroundColor: "red",
          }}
        >
          <div className="dashboard-sidebar">
            <Sidebar tabs={tabs} setActiveTabs={setActiveTabs}  setActiveTab={setActiveTab}/>
          </div>

          <div style={{display:"flex",height:"100%",width:"100%",flexDirection:"column"}}>
            <div className="dashboard-table-tab">
              <Tab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} setActiveTabs={setActiveTabs}/>
            </div>

            <div className="dashboard-table">
              <Table activeTab={activeTab}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;


export type tab={
  tab_name:string
  table_id:string
  columns:any
}