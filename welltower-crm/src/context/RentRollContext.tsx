import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type RentRollRow = {
  date: string
  propertyId: string
  propertyName: string
  unitNumber: string
  residentId: string
  residentName: string
  monthlyRent: string | number
}

export type CommunityKpi = {
  name: string
  avgRent: number
  occupancy: number
  moveIns: number
  moveOuts: number
  numUnits: number
}

export type UnitOption = {
  propertyName: string
  unitNumber: string
}

type RentRollContextValue = {
  rentRoll: RentRollRow[]
  filteredRentRoll: RentRollRow[]
  kpis: CommunityKpi[]
  properties: string[]
  vacantUnits: UnitOption[]
  occupiedUnits: UnitOption[]
  moveInResident: (args: {
    propertyName: string
    unitNumber: string
    date: string
    residentName: string
    monthlyRent: number
  }) => void
  moveOutResident: (args: { propertyName: string; unitNumber: string; date: string }) => void
  selectedProperty: string
  setSelectedProperty: (property: string) => void
  selectedOccupancy: string
  setSelectedOccupancy: (value: string) => void
  searchQuery: string
  setSearchQuery: (value: string) => void
  startDateRange: string
  endDateRange: string
  setStartDateRange: (date: string) => void
  setEndDateRange: (date: string) => void
  snapshotDate: string
  setSnapshotDate: (date: string) => void
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const RentRollContext = createContext<RentRollContextValue | undefined>(undefined)

function RentRollProvider({ children }: { children: React.ReactNode }) {
  const [rentRoll, setRentRoll] = useState<RentRollRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [snapshotDate, setSnapshotDate] = useState('')
  const [selectedProperty, setSelectedProperty] = useState('')
  const [selectedOccupancy, setSelectedOccupancy] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [startDateRange, setStartDateRange] = useState('')
  const [endDateRange, setEndDateRange] = useState('')

  const fetchRentRoll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:8080/api/rent-roll')
      if (!response.ok) {
        throw new Error(`Failed to fetch rent roll: ${response.status}`)
      }
      const data = (await response.json()) as RentRollRow[]
      setRentRoll(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rent roll')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRentRoll()
  }, [fetchRentRoll])

  useEffect(() => {
    if (!snapshotDate && rentRoll.length > 0) {
      setSnapshotDate(rentRoll[0].date)
    }
  }, [rentRoll, snapshotDate])

  useEffect(() => {
    if (rentRoll.length === 0) {
      return
    }
    if (!startDateRange || !endDateRange) {
      const dates = rentRoll.map((row) => row.date).filter(Boolean).sort()
      if (!startDateRange) {
        setStartDateRange(dates[0] ?? '')
      }
      if (!endDateRange) {
        setEndDateRange(dates[dates.length - 1] ?? '')
      }
    }
  }, [rentRoll, startDateRange, endDateRange])

  const filteredRentRoll = useMemo(() => {
    return rentRoll.filter((row) => {
      if (snapshotDate && row.date !== snapshotDate) {
        return false
      }
      if (selectedProperty && row.propertyName !== selectedProperty) {
        return false
      }
      if (selectedOccupancy) {
        const isOccupied = Boolean(row.residentName?.trim())
        if (selectedOccupancy === 'occupied' && !isOccupied) {
          return false
        }
        if (selectedOccupancy === 'vacant' && isOccupied) {
          return false
        }
      }
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase()
        const unit = row.unitNumber?.toLowerCase() ?? ''
        const resident = row.residentName?.toLowerCase() ?? ''
        const unitMatch = unit.startsWith(query)
        const residentMatch = resident.startsWith(query)
        if (!unitMatch && !residentMatch) {
          return false
        }
      }
      return true
    })
  }, [rentRoll, snapshotDate, selectedProperty, selectedOccupancy, searchQuery])

  const properties = useMemo(() => {
    const byId = new Map<string, string>()
    rentRoll.forEach((row) => {
      if (row.propertyId && !byId.has(row.propertyId)) {
        byId.set(row.propertyId, row.propertyName)
      }
    })
    return Array.from(byId.values())
  }, [rentRoll])

  const snapshotRows = useMemo(() => {
    if (!snapshotDate) {
      return rentRoll
    }
    return rentRoll.filter((row) => row.date === snapshotDate)
  }, [rentRoll, snapshotDate])

  const vacantUnits = useMemo<UnitOption[]>(() => {
    const byUnit = new Map<string, UnitOption>()
    snapshotRows
      .filter((row) => !row.residentName?.trim())
      .forEach((row) => {
        const key = `${row.propertyName}-${row.unitNumber}`
        if (!byUnit.has(key)) {
          byUnit.set(key, { propertyName: row.propertyName, unitNumber: row.unitNumber })
        }
      })
    return Array.from(byUnit.values())
  }, [snapshotRows])

  const occupiedUnits = useMemo<UnitOption[]>(() => {
    const byUnit = new Map<string, UnitOption>()
    snapshotRows
      .filter((row) => row.residentName?.trim())
      .forEach((row) => {
        const key = `${row.propertyName}-${row.unitNumber}`
        if (!byUnit.has(key)) {
          byUnit.set(key, { propertyName: row.propertyName, unitNumber: row.unitNumber })
        }
      })
    return Array.from(byUnit.values())
  }, [snapshotRows])

  const moveInResident = useCallback(
    ({
      propertyName,
      unitNumber,
      date,
      residentName,
      monthlyRent,
    }: {
      propertyName: string
      unitNumber: string
      date: string
      residentName: string
      monthlyRent: number
    }) => {
      if (!propertyName || !unitNumber || !date || !residentName) {
        return
      }
      setRentRoll((prev) => {
        let updatedAny = false
        const next = prev.map((row) => {
          if (row.propertyName !== propertyName || row.unitNumber !== unitNumber) {
            return row
          }
          if (row.date < date) {
            return row
          }
          updatedAny = true
          return {
            ...row,
            residentName,
            residentId: residentName,
            monthlyRent,
          }
        })

        if (updatedAny) {
          return next
        }

        // Insert new row into the rent roll if date is great then the last date in rent roll
        const base = prev.find((row) => row.propertyName === propertyName && row.unitNumber === unitNumber)
        const updated: RentRollRow = {
          ...(base ?? {
            propertyId: '',
            propertyName,
            unitNumber,
            residentId: '',
            residentName: '',
            monthlyRent: 0,
            date,
          }),
          date,
          propertyName,
          unitNumber,
          residentName,
          residentId: residentName,
          monthlyRent,
        }

        return [...next, updated]
      })
    },
    []
  )

  const moveOutResident = useCallback(
    ({ propertyName, unitNumber, date }: { propertyName: string; unitNumber: string; date: string }) => {
      if (!propertyName || !unitNumber || !date) {
        return
      }
      setRentRoll((prev) => {
        let updatedAny = false
        const next = prev.map((row) => {
          if (row.propertyName !== propertyName || row.unitNumber !== unitNumber) {
            return row
          }
          if (row.date < date) {
            return row
          }
          updatedAny = true
          return {
            ...row,
            residentName: '',
            residentId: '',
            monthlyRent: 0,
          }
        })

        if (updatedAny) {
          return next
        }

        // Add new record to rent roll with vacant unit details
        const base = prev.find((row) => row.propertyName === propertyName && row.unitNumber === unitNumber)
        if (!base) {
          return next
        }

        const updated: RentRollRow = {
          ...base,
          date,
          residentName: '',
          residentId: '',
          monthlyRent: 0,
        }

        return [...next, updated]
      })
    },
    []
  )

  const kpiRentRoll = useMemo(() => {
    if (!startDateRange || !endDateRange) {
      return []
    }
    return rentRoll.filter((row) => row.date >= startDateRange && row.date <= endDateRange)
  }, [rentRoll, startDateRange, endDateRange])


  const kpis = useMemo<CommunityKpi[]>(() => {
    if (!startDateRange || !endDateRange) {
      return []
    }
    const startRows = kpiRentRoll.filter((row) => row.date === startDateRange)
    const endRows = kpiRentRoll.filter((row) => row.date === endDateRange)
    const datesInRange = Array.from(new Set(kpiRentRoll.map((row) => row.date))).sort()

    const byProperty = new Map<
      string,
      {
        startRows: RentRollRow[]
        endRows: RentRollRow[]
      }
    >()

    const addRows = (rows: RentRollRow[], key: 'startRows' | 'endRows') => {
      rows.forEach((row) => {
        const name = row.propertyName || 'Unknown'
        const entry = byProperty.get(name) ?? { startRows: [], endRows: [] }
        entry[key].push(row)
        byProperty.set(name, entry)
      })
    }

    addRows(startRows, 'startRows')
    addRows(endRows, 'endRows')

    const toResidentKey = (row: RentRollRow) => row.residentId || row.residentName || ''
    const isOccupied = (row: RentRollRow) => Boolean(row.residentName?.trim())

    return Array.from(byProperty.entries()).map(([name, { startRows, endRows }]) => {
      const endOccupied = endRows.filter((row) => row.residentName?.trim())
      const totalUnits = endRows.length
      const avgRent =
        endOccupied.length === 0
          ? 0
          : endOccupied.reduce((sum, row) => {
            const value = Number(row.monthlyRent)
            return Number.isNaN(value) ? sum : sum + value
          }, 0) / endOccupied.length
      const occupancy = totalUnits === 0 ? 0 : endOccupied.length / totalUnits

      const unitsByDate = new Map<string, Map<string, Map<string, RentRollRow>>>()
      kpiRentRoll.forEach((row) => {
        if (row.propertyName !== name) {
          return
        }
        const unitKey = row.unitNumber
        const propertyUnits = unitsByDate.get(name) ?? new Map()
        const dateMap = propertyUnits.get(unitKey) ?? new Map()
        dateMap.set(row.date, row)
        propertyUnits.set(unitKey, dateMap)
        unitsByDate.set(name, propertyUnits)
      })

      let moveIns = 0
      let moveOuts = 0

      const propertyUnits = unitsByDate.get(name)
      if (propertyUnits) {
        propertyUnits.forEach((dateMap) => {
          let prevRow: RentRollRow | null = null
          datesInRange.forEach((date) => {
            const row = dateMap.get(date)
            if (!row) {
              return
            }
            if (!prevRow) {
              prevRow = row
              return
            }
            const prevOccupied = isOccupied(prevRow)
            const nextOccupied = isOccupied(row)
            const prevResident = toResidentKey(prevRow)
            const nextResident = toResidentKey(row)

            if (!prevOccupied && nextOccupied) {
              moveIns += 1
            } else if (prevOccupied && !nextOccupied) {
              moveOuts += 1
            } else if (prevOccupied && nextOccupied && prevResident && nextResident && prevResident !== nextResident) {
              moveOuts += 1
              moveIns += 1
            }

            prevRow = row
          })
        })
      }

      return {
        name,
        avgRent,
        occupancy,
        moveIns,
        moveOuts,
        numUnits: totalUnits,
      }
    })
  }, [kpiRentRoll, startDateRange, endDateRange])

  const value = useMemo(
    () => ({
      rentRoll,
      filteredRentRoll,
      kpis,
      properties,
      vacantUnits,
      occupiedUnits,
      moveInResident,
      moveOutResident,
      selectedProperty,
      setSelectedProperty,
      selectedOccupancy,
      setSelectedOccupancy,
      searchQuery,
      setSearchQuery,
      startDateRange,
      endDateRange,
      setStartDateRange,
      setEndDateRange,
      snapshotDate,
      setSnapshotDate,
      isLoading,
      error,
      refetch: fetchRentRoll,
    }),
    [
      rentRoll,
      filteredRentRoll,
      kpis,
      properties,
      vacantUnits,
      occupiedUnits,
      moveInResident,
      moveOutResident,
      selectedProperty,
      selectedOccupancy,
      searchQuery,
      startDateRange,
      endDateRange,
      snapshotDate,
      isLoading,
      error,
      fetchRentRoll,
    ]
  )

  return <RentRollContext.Provider value={value}>{children}</RentRollContext.Provider>
}

function useRentRoll() {
  const context = useContext(RentRollContext)
  if (!context) {
    throw new Error('useRentRoll must be used within a RentRollProvider')
  }
  return context
}

export { RentRollProvider, useRentRoll }
