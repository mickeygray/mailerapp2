import React, { useState,useContext, useEffect } from "react";
import ListItem from "./ListItem";
import KeyModal from "./KeyModal";
import LeadContext from "../context/lead/leadContext";

const ListViewer = () => {
  const leadContext = useContext(LeadContext);

  const { leads, clearLeads, getLexs, keys, postLeads, getDups,sendTodays,getReleases } = leadContext;

  const [startDate, setStartDate] = useState(new Date(Date.now()))
  const [endDate, setEndDate] = useState(new Date(Date.now()))

  const onChange = e =>{
	 setStartDate(e.target.value)
  } 

  const onChange2 = e =>{
         setEndDate(e.target.value) 
  }	  

  const dates = {startDate, endDate}	
  return (
    <div className='grid-2'>
      <div>
    <button className="p-2 btn btn-sm btn-danger" onClick={()=>getDups()}> Get All Dups </button>  
       <button className="p-2 btn btn-sm btn-success" onClick={()=>sendTodays()}>Send Todays Scrapes</button>
    <button className="p-2 btn btn-sm btn-primary" onClick={()=>getReleases(dates)}>Get Range Releases</button>    
      <button className="btn btn-sm btn-dark" onClick={()=>getLexs(dates)}>Get Range Lexis Info</button>

     </div>
      <div>
        <form>
	  <div className='grid-2'>
           
	  <div>
	    <label>Enter a Date Range </label>
            <input
              type='date'
              name='startDate'
              value={
                startDate &&
                Intl.DateTimeFormat("fr-CA", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                }).format(new Date(startDate))
              }
              id='startDate'
              onChange={onChange}
            /> 
           </div>
	  <div>
	     <input
              type='date'
              name='endDate'
              value={
                startDate &&
                Intl.DateTimeFormat("fr-CA", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                }).format(new Date(endDate))
              }
              id='endDate'
              onChange={onChange2}
            />
	  </div>
	  </div>
	</form>  
  
	
      

     </div>
    {keys.length > 0 ? <KeyModal keys={keys}/> :''}	  
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
