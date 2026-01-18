import React, { useState } from 'react'
import { useRentRoll } from '../context/RentRollContext'

function Transactions() {
  const { vacantUnits, occupiedUnits, moveInResident, moveOutResident } = useRentRoll()
  const [moveInUnit, setMoveInUnit] = useState('')
  const [moveOutUnit, setMoveOutUnit] = useState('')
  const [residentName, setResidentName] = useState('')
  const [moveInDate, setMoveInDate] = useState('')
  const [moveOutDate, setMoveOutDate] = useState('')
  const [rent, setRent] = useState('')

  const parseUnitValue = (value: string) => {
    const [propertyName, unitNumber] = value.split('::')
    return { propertyName: propertyName ?? '', unitNumber: unitNumber ?? '' }
  }

  const handleMoveIn = () => {
    const { propertyName, unitNumber } = parseUnitValue(moveInUnit)
    const monthlyRent = Number(rent)
    if (!propertyName || !unitNumber || !residentName || !moveInDate || Number.isNaN(monthlyRent)) {
      return
    }
    moveInResident({ propertyName, unitNumber, date: moveInDate, residentName, monthlyRent })
    setMoveInUnit('')
    setResidentName('')
    setMoveInDate('')
    setRent('')
  }

  const handleMoveOut = () => {
    const { propertyName, unitNumber } = parseUnitValue(moveOutUnit)
    if (!propertyName || !unitNumber || !moveOutDate) {
      return
    }
    moveOutResident({ propertyName, unitNumber, date: moveOutDate })
    setMoveOutUnit('')
    setMoveOutDate('')
  }

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>

      {/* title container */}
      <div className='mb-4'>
        <h1 className='text-lg font-semibold'>Transactions</h1>
        <p className='text-sm text-gray-600'>View all transactions for the portfolio</p>
      </div>

      {/* actions container */}
      <div className='flex w-full flex-col gap-6 md:flex-row'>

        {/* move in card */}
        <div className='flex w-full flex-col gap-2 md:w-1/2'>
          <h1 className='text-base font-semibold'>Move In</h1>
          <p className='text-sm text-gray-600'>Vacant Unit</p>
          <select
            name="move-in-unit"
            id="move-in-unit"
            className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
            value={moveInUnit}
            onChange={(event) => setMoveInUnit(event.target.value)}
          >
            <option value="">Select a unit</option>
            {vacantUnits.map((unit) => (
              <option key={`${unit.propertyName}-${unit.unitNumber}`} value={`${unit.propertyName}::${unit.unitNumber}`}>
                {unit.propertyName} - {unit.unitNumber}
              </option>
            ))}
          </select>
          <p className='text-sm text-gray-600'>Resident Name</p>
          <input
            type="text"
            name="resident-name"
            id="resident-name"
            className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
            value={residentName}
            onChange={(event) => setResidentName(event.target.value)}
          />
          <p className='text-sm text-gray-600'>Move In Date</p>
          <input
            type="date"
            name="move-in-date"
            id="move-in-date"
            value={moveInDate}
            onChange={(event) => setMoveInDate(event.target.value)}
            className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
          />
          <p className='text-sm text-gray-600'>Rent</p>
          <input
            type="number"
            name="rent"
            id="rent"
            className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
            value={rent}
            onChange={(event) => setRent(event.target.value)}
          />
          <div
            className='cursor-pointer rounded-md bg-gray-900 px-3 py-2 text-center text-base font-medium text-white transition hover:bg-gray-800'
            onClick={handleMoveIn}
          >
            Move In
          </div>
        </div>


        {/* move out card */}
        <div className='flex w-full flex-col gap-2 md:w-1/2'>
          <h1 className='text-base font-semibold'>Move Out</h1>
          <p className='text-sm text-gray-600'>Occupied Unit</p>
          <select
            name="move-out-unit"
            id="move-out-unit"
            className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
            value={moveOutUnit}
            onChange={(event) => setMoveOutUnit(event.target.value)}
          >
            <option value="">Select a unit</option>
            {occupiedUnits.map((unit) => (
              <option key={`${unit.propertyName}-${unit.unitNumber}`} value={`${unit.propertyName}::${unit.unitNumber}`}>
                {unit.propertyName} - {unit.unitNumber}
              </option>
            ))}
          </select>
          <p className='text-sm text-gray-600'>Move Out Date</p>
          <input
            type="date"
            name="move-out-date"
            id="move-out-date"
            value={moveOutDate}
            onChange={(event) => setMoveOutDate(event.target.value)}
            className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
          />
          <div
            className='cursor-pointer rounded-md bg-gray-900 px-3 py-2 text-center text-base font-medium text-white transition hover:bg-gray-800'
            onClick={handleMoveOut}
          >
            Move Out
          </div>

        </div>

      </div>


    </div>
  )
}

export default Transactions
