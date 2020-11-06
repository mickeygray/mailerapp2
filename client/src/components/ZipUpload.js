import React,{useState, useContext} from 'react'
import MailContext from '../context/MailContext/mailContext'

const ZipUpload = () => {
 const [file, setFile] = useState("");

  const onUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const mailContext = useContext(MailContext)

  const {submitZips} = mailContext
 

  const onClick = e =>{
    submitZips(file)  
  }
    return (
        <div>
             <input type='file' onChange={onUpload} style={{ width: "200px" }} />
             <button onClick={onClick}>Click</button>
        </div>
    )
}

export default ZipUpload
