import React from 'react'
import { useRentRoll } from '../context/RentRollContext'

function HeaderSection() {
  const { snapshotDate, setSnapshotDate } = useRentRoll()
  return (
    <div className='flex w-full items-start justify-between gap-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>

      {/* title container */}
      <div className='flex flex-col items-start'>
        <h1 className='text-2xl font-semibold'>Rent Roll Manager</h1>
        <p className='text-sm text-gray-600'>Manage your rent roll and view KPI's</p>
      </div>

      {/* Date selector */}
      <div className='flex flex-col items-start gap-1'>
        <p className='text-sm text-gray-600'>Snapshot Date</p>
        <input
          type="date"
          name="date"
          id="date"
          value={snapshotDate}
          onChange={(event) => setSnapshotDate(event.target.value)}
          className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
        />
      </div>


    </div>
  )
}

export default HeaderSection
