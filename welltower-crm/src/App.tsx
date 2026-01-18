import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import CRM from './CRM'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">

      <CRM /> 

    </div>
  )
}

export default App
