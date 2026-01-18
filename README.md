# Welltower Take-Home

## Run Instructions

Prerequisites: Install bun on your machine

### Back End (Express)
`cd welltower-api`
`bun install`
`bun run server.ts`

API runs on http://localhost:8080

### Front End (Vite)
`cd welltower-crm`
`bun install`
`bun run dev`

App runs on http://localhost:3000

## Tests

`cd welltower-api && bun test`

The backend test starts the ExpressJS server, fetches JSON rent roll, and ensures the data quality of the response.

`cd welltower-crm && bun run test`

The front end tests utilize vitest and ensure rendering and calculations are correct by mocking rent roll data. Move in & out actions are also performed and tested for proper updates.


## Technology Stack

Bun, Vite (React), ExpressJS 

This implementation uses a simple express server to read and make available rent roll data in json format. The Vite front end delivers a React SPA which queries the express server, serves rent roll data and analysis, and implements move in & out actions across timeseries data.

## React Data Patterns

The implementation in RentRollContext.tsx uses the React Context API to handle state and provide functionality independant of component tree depth. This allows a modular growth of the application as complexity increases. In the context we query data, apply filters, calculate analysis, and provide actions on the data. 

### Interesting Analysis

Our KPI calculations use the selected date range and compute metrics per community. Avg rent and occupancy come from the end‑date snapshot, while move‑ins/outs are derived by iterating through each unit’s records and counting occupancy transitions across the range.
### State Consistency

Context is the single source of truth for rent roll data, filters, and KPI's. Each state value is memoized with explicit dependencies (date range, snapshot date, filters), so any change automatically recalculates the dependent slices and metrics. This keeps the UI aligned and makes move-ins/outs, filters, and KPI recalculations update in a deterministic fashion.
