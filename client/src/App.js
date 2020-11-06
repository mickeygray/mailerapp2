import React from 'react'
import MailState from './context/MailContext/MailState'
import Upload from "../src/components/Upload"
import CsvViewModal from "../src/components/CsvViewModal"
import Dunder from "./components/Dunder"
import "./App.css";





const App = () => {
  return (
    <MailState>
    <div>
      <Upload/>
    </div>
    <div>
      <Dunder/>

    </div>



    </MailState>
  )
}

export default App



