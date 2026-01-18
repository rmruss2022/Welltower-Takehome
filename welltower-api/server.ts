import express from "express";
import cors from "cors";
import fs from "fs";
import { parse } from "csv-parse/sync";
import type { Request, Response } from "express";

const app = express();
const port = 8080;

app.use(cors());


const readRentRollCSV = () => {
  const rentRollFile = fs.readFileSync("rent_roll.csv", "utf8");
  const rentRoll = parse(rentRollFile, { columns: true });

  return rentRoll.map((row: any) => {
    return {
      date: row.date,
      propertyId: row.property_id,
      propertyName: row.property_name,
      unitNumber: row.unit_number,
      residentId: row.resident_id,
      residentName: row.resident_name,
      monthlyRent: row.monthly_rent,
    };
  });
};

app.get("/", (req: Request, res: Response) => {
  res.send("Health Check!");
});


app.get("/api/rent-roll", (req: Request, res: Response) => {
  const rentRoll = readRentRollCSV();
  res.json(rentRoll);
});

const startServer = (listenPort = port) => {
  return app.listen(listenPort, () => {
    console.log(`Listening on port ${listenPort}...`);
  });
};

if (import.meta.main) {
  startServer();
}

export { app, startServer };