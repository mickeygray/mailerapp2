import React, { useContext, useEffect } from "react";
import ListItem from "./ListItem";
import LeadContext from "../context/lead/leadContext";

const ListViewer = () => {
  const leadContext = useContext(LeadContext);

  const { leads, clearLeads, postLeads, getDups,sendTodays } = leadContext;

  return (
    <div>
      
    <button className="p-2 btn btn-sm btn-danger" onClick={()=>getDups()}> Get All Dups </button>  
       <button className="p-2 btn btn-sm btn-success" onClick={()=>sendTodays()}>Send Todays Scrapes</button>
      
      <br/>
      <br/>
            
      {leads.length > 0 ? 
      
      <div className='grid-2'>
        <div> <button onClick={()=>clearLeads()} className='btn btn-dark btn-block'>Clear Leads</button></div>
        <div> <button onClick={()=>postLeads(leads)}className='btn btn-success btn-block'>Post Leads</button></div>

      
      </div>:''}
      <div className = 'grid-2'>

       <div>      {leads.length > 0 ?         leads.filter(function(item) {
           return item["dob"] === undefined;
        
          }).map((lead) => <ListItem key={lead.dupId} lead={lead} />)
        : ""}</div>
       <div>      
         {leads.length > 0 ?
         
         leads.filter(function(item) {
           return item["dob"] !== undefined;
        
          }).map((lead) => <ListItem key={lead.dupId} lead={lead} />)
        
        : ""}</div> 


        </div>
    </div>
  );
};

export default ListViewer;
