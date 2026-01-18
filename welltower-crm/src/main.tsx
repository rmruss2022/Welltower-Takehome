import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { RentRollProvider } from './context/RentRollContext'

ReactDOM.render(
  <React.StrictMode>
    <RentRollProvider>
      <App />
    </RentRollProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
