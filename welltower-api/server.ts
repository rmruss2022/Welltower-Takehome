const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csvParser = require("csv-parse/sync");
import type { Request, Response } from "express";
const app = express();
const port = 8080;

app.use(cors());


const readRentRollCSV = () => {
    const rentRollFile = fs.readFileSync("rent_roll.csv", "utf8");
    const rentRoll = csvParser.parse(rentRollFile, { columns: true });
    
    return rentRoll.map((row: any) => {
        return {
            date: row.date,
            propertyId: row.property_id,
            propertyName: row.property_name,
            unitNumber: row.unit_number,
            residentId: row.resident_id,
            residentName: row.resident_name,
            monthlyRent: row.monthly_rent,
        }
    });
}

app.get("/", (req: Request, res: Response) => {
  res.send("Hello There!");
});


app.get("/api/rent-roll", (req: Request, res: Response) => {
    console.log("Rent Roll API called");
    const rentRoll = readRentRollCSV();  
    res.json(rentRoll);
  });

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});