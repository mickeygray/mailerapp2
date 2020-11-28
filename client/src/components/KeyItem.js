import React, {useState,useContext } from "react";


const KeyItem = ({mailKey,lexisInfo, fullName, address  }) => {
  
  const [keyStyle, setKeyStyle] = useState({
  backgroundColor:'yellow'
  })	

  return (
    <div style={keyStyle}>
     <ul style={{display:'flex'}}>
     <li>
      MailKey:
      <br/>	  
      {mailKey}
     </li>
     <li>
     Lexis Info:
     <br/>	  
     {lexisInfo}	  
     </li>
     <li>
     Full Name:
     <br/>
     {fullName}	  
     </li>	  
     <li>
      Address:
      <br/>
      {address}
     </li>
     <li style={{paddingTop: '8px'}}>
      <button onClick={()=>setKeyStyle({backgroundColor:'green'})}>Search Complete</button>	  
     </li>
     </ul>	  
     </div>
  );
};

export default KeyItem;

