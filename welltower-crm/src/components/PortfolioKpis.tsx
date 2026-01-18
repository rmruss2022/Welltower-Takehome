import React from 'react'
import { useRentRoll } from '../context/RentRollContext'

function PortfolioKpis() {
  const { kpis, startDateRange, endDateRange, setStartDateRange, setEndDateRange } = useRentRoll()
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
  const percentFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 1,
  })
  const rangeDays = (() => {
    if (!startDateRange || !endDateRange) {
      return 0
    }
    const start = new Date(startDateRange)
    const end = new Date(endDateRange)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 0
    }
    const diffMs = end.getTime() - start.getTime()
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1)
  })()
  return (
    <div className='flex flex-col gap-4'>

      {/* title container */}
      <div className='flex items-start justify-between self-start w-full'>

        {/* title */}
        <h1 className='text-xl font-semibold'>Portfolio KPI's</h1>

        {/* date range selector */}
        <div className='flex gap-4'>

          <div className='flex flex-col items-start gap-1'>
            <p className='text-sm text-gray-600'>Range Start</p>
            <input
              type="date"
              name="range-start"
              id="range-start"
              value={startDateRange}
              onChange={(event) => setStartDateRange(event.target.value)}
              className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
            />
          </div>


          <div className='flex flex-col items-start gap-1'>
            <p className='text-sm text-gray-600'>Range End</p>
            <input
              type="date"
              name="range-end"
              id="range-end"
              value={endDateRange}
              onChange={(event) => setEndDateRange(event.target.value)}
              className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
            />
          </div>
        </div>

      </div>


      {/* KPI cards container */}
      <div className='grid grid-cols-3 gap-4'>


        {kpis.map((kpi) => (
          <div className='rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm'>
            <div className='flex items-start justify-between'>
              <h1 className='text-base font-semibold text-gray-900'>{kpi.name}</h1>
              <span className='text-xs text-gray-500'>{rangeDays} days</span>
            </div>
            <div className='mt-3 space-y-1 text-sm'>
              <div className='flex items-center justify-between text-gray-600'>
                <span>Avg Rent</span>
                <span className='font-medium text-gray-900'>{currencyFormatter.format(kpi.avgRent)}</span>
              </div>
              <div className='flex items-center justify-between text-gray-600'>
                <span>Occupancy</span>
                <span className='font-medium text-gray-900'>{percentFormatter.format(kpi.occupancy)}</span>
              </div>
              <div className='flex items-center justify-between text-gray-600'>
                <span>Move-ins</span>
                <span className='font-medium text-gray-900'>{kpi.moveIns}</span>
              </div>
              <div className='flex items-center justify-between text-gray-600'>
                <span>Move-outs</span>
                <span className='font-medium text-gray-900'>{kpi.moveOuts}</span>
              </div>
              <div className='flex items-center justify-between text-gray-600'>
                <span>Units</span>
                <span className='font-medium text-gray-900'>{kpi.numUnits}</span>
              </div>
            </div>
          </div>
        ))}






      </div>





    </div>
  )
}

export default PortfolioKpis
