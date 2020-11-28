import React,{useContext} from "react";
import LeadContext from "../context/lead/leadContext.js"
import KeyItem from "./KeyItem"
const KeyModal = ({keys}) =>{ 
     
   const leadContext = useContext(LeadContext)
   const {setKeys}= leadContext	

       return(
  
    <div className='bg-light container card' style={{ width: "600px", height: "100%" }}>
      
            <button onClick={()=>setKeys([])}>X</button>
	       {keys.map((key1)=>{<KeyItem key={key1.mailKey} key1={key1}/>})}  
        
        
    </div>
  
)
}
;
export default KeyModal;

