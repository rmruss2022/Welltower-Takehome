import React from 'react'
import HeaderSection from './components/HeaderSection'
import PortfolioKpis from './components/PortfolioKpis'
import Transactions from './components/Transactions'
import RentRoll from './components/RentRoll'

function CRM() {
  return (

    // screen
    <div className="min-h-screen bg-gray-50 py-8">


      {/* content container */}
      <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4">

        <HeaderSection />
        <PortfolioKpis />
        <Transactions />
        <RentRoll />

      </div>


    </div>


  )
}

export default CRM
