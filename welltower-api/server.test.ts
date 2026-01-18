import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import type { Server } from "http";
import { startServer } from "./server";

describe("API", () => {
  let server: Server;
  let baseUrl = "";

  beforeAll(async () => {
    server = startServer(0);
    await new Promise<void>((resolve) => server.on("listening", resolve));
    const address = server.address();
    if (typeof address === "object" && address?.port) {
      baseUrl = `http://localhost:${address.port}`;
    }
  });

  afterAll(() => {
    server?.close();
  });

  it("returns JSON rent roll data", async () => {
    const response = await fetch(`${baseUrl}/api/rent-roll`);
    const data = (await response.json()) as Array<Record<string, unknown>>;

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty("propertyName");
    expect(data[0]).toHaveProperty("unitNumber");

    expect(data[0]).toMatchObject({
      date: "2024-12-03",
      propertyId: "1",
      propertyName: "Sunset Gardens",
      unitNumber: "P1-U01",
      residentId: "",
      residentName: "",
      monthlyRent: "0",
    });

    expect(data[data.length - 1]).toMatchObject({
      date: "2025-03-01",
      propertyId: "3",
      propertyName: "Oakwood Care Community",
      unitNumber: "P3-U50",
      residentId: "",
      residentName: "",
      monthlyRent: "0",
    });
  });
});
