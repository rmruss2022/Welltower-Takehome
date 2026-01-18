import React from 'react'
import { useRentRoll } from '../context/RentRollContext'

function RentRoll() {
  const {
    filteredRentRoll,
    isLoading,
    error,
    properties,
    selectedProperty,
    setSelectedProperty,
    selectedOccupancy,
    setSelectedOccupancy,
    searchQuery,
    setSearchQuery,
  } = useRentRoll()
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
  return (
    <div className='flex flex-col gap-4'>


      {/* Table Controls */}
      <div className='flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
        <div className='flex w-full items-center justify-between'>
          <h1 className='text-lg font-semibold'>Rent Roll</h1>

          {/* Filter Container */}
          <div className='flex gap-3'>

            {/* Filter by property */}
            <div className='flex flex-col gap-1'>
              <p className='text-sm text-gray-600'>Property</p>
              <select
                name="property"
                id="property"
                aria-label="Property Filter"
                className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
                value={selectedProperty}
                onChange={(event) => setSelectedProperty(event.target.value)}
              >
                <option value="">All</option>
                {properties.map((property) => (
                  <option key={property} value={property}>
                    {property}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Occupancy */}
            <div className='flex flex-col gap-1'>
              <p className='text-sm text-gray-600'>Occupancy</p>
              <select
                name="occupancy"
                id="occupancy"
                aria-label="Occupancy Filter"
                className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
                value={selectedOccupancy}
                onChange={(event) => setSelectedOccupancy(event.target.value)}
              >
                <option value="">All</option>
                <option value="occupied">Occupied</option>
                <option value="vacant">Vacant</option>
              </select>
            </div>

            {/* Search by Unit or Resident Name */}
            <div className='flex flex-col gap-1'>
              <p className='text-sm text-gray-600'>Search</p>
              <input
                type="text"
                name="search"
                id="search"
                aria-label="Rent Roll Search"
                className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>

          </div>

        </div>


        {/* Table */}
        <div className='w-full overflow-x-auto'>

          {isLoading ? <p>Loading rent roll...</p> : null}
          {error ? <p>{error}</p> : null}

          <table className='w-full text-left text-sm'>
            <thead>
              <tr className='text-xs uppercase tracking-wide text-gray-500'>
                <th>Property</th>
                <th>Unit</th>
                <th>Resident</th>
                <th>Monthly Rent</th>
                <th>Occupancy</th>
              </tr>
            </thead>
            <tbody>
              {filteredRentRoll.map((unit, idx) => {
                const isOccupied = unit.residentName?.trim();
                return (
                  <tr
                    key={unit.propertyName + '-' + unit.unitNumber + '-' + idx}
                    className={`border-t border-gray-100 ${
                      isOccupied
                        ? 'bg-green-100'
                        : 'bg-red-100'
                    }`}
                    style={{ height: '3rem' }} // Increase row height
                  >
                    <td className='py-3'>{unit.propertyName}</td>
                    <td className='py-3'>{unit.unitNumber}</td>
                    <td className='py-3'>{unit.residentName}</td>
                    <td className='py-3 text-left'>{currencyFormatter.format(Number(unit.monthlyRent) || 0)}</td>
                    <td
                      className={`py-3 font-semibold`}
                    >
                      <span
                        className={`px-2 py-1 rounded ${
                          isOccupied ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'
                        }`}
                      >
                        {isOccupied ? 'Occupied' : 'Vacant'}
                      </span>
                    </td>
                  </tr>
                );
              })}


            </tbody>
          </table>





        </div>


      </div>





    </div>
  )
}

export default RentRoll
