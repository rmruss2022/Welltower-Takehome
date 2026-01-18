import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { RentRollProvider } from "../context/RentRollContext";
import CRM from "../CRM";

const mockRentRoll = [
  {
    date: "2024-12-03",
    propertyId: "1",
    propertyName: "Sunset Gardens",
    unitNumber: "P1-U01",
    residentId: "",
    residentName: "",
    monthlyRent: "0",
  },
  {
    date: "2024-12-03",
    propertyId: "1",
    propertyName: "Sunset Gardens",
    unitNumber: "P1-U02",
    residentId: "A1",
    residentName: "Resident A",
    monthlyRent: "1000",
  },
  {
    date: "2024-12-04",
    propertyId: "1",
    propertyName: "Sunset Gardens",
    unitNumber: "P1-U01",
    residentId: "",
    residentName: "",
    monthlyRent: "0",
  },
  {
    date: "2024-12-04",
    propertyId: "1",
    propertyName: "Sunset Gardens",
    unitNumber: "P1-U02",
    residentId: "A1",
    residentName: "Resident A",
    monthlyRent: "1000",
  },
  {
    date: "2024-12-05",
    propertyId: "1",
    propertyName: "Sunset Gardens",
    unitNumber: "P1-U01",
    residentId: "B1",
    residentName: "Resident B",
    monthlyRent: "1200",
  },
  {
    date: "2024-12-05",
    propertyId: "1",
    propertyName: "Sunset Gardens",
    unitNumber: "P1-U02",
    residentId: "A1",
    residentName: "Resident A",
    monthlyRent: "1000",
  },
  {
    date: "2024-12-03",
    propertyId: "2",
    propertyName: "Meadowbrook Senior Living",
    unitNumber: "P2-U01",
    residentId: "C1",
    residentName: "Resident C",
    monthlyRent: "900",
  },
  {
    date: "2024-12-04",
    propertyId: "2",
    propertyName: "Meadowbrook Senior Living",
    unitNumber: "P2-U01",
    residentId: "D1",
    residentName: "Resident D",
    monthlyRent: "950",
  },
  {
    date: "2024-12-05",
    propertyId: "2",
    propertyName: "Meadowbrook Senior Living",
    unitNumber: "P2-U01",
    residentId: "D1",
    residentName: "Resident D",
    monthlyRent: "950",
  },
];

const renderApp = () =>
  render(
    <RentRollProvider>
      <CRM />
    </RentRollProvider>
  );

beforeEach(() => {
  globalThis.fetch = vi.fn(async () => {
    return new Response(JSON.stringify(mockRentRoll), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as unknown as typeof fetch;
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("CRM UI", () => {
  it("renders expected KPI values", async () => {
    renderApp();

    const sunsetCard = await screen.findByTestId("kpi-card-Sunset-Gardens");
    expect(within(sunsetCard).getByText("$1,100")).toBeInTheDocument();
    expect(within(sunsetCard).getByText("100%")).toBeInTheDocument();
    expect(within(sunsetCard).getByText("Move-ins").parentElement).toHaveTextContent("Move-ins1");
    expect(within(sunsetCard).getByText("Move-outs").parentElement).toHaveTextContent("Move-outs0");

    const meadowCard = screen.getByTestId("kpi-card-Meadowbrook-Senior-Living");
    expect(within(meadowCard).getByText("$950")).toBeInTheDocument();
    expect(within(meadowCard).getByText("100%")).toBeInTheDocument();
    expect(within(meadowCard).getByText("Move-ins").parentElement).toHaveTextContent("Move-ins1");
    expect(within(meadowCard).getByText("Move-outs").parentElement).toHaveTextContent("Move-outs1");
  });

  it("shows occupied/vacant units for the selected snapshot date", async () => {
    renderApp();
    await screen.findByText("Rent Roll");

    fireEvent.change(screen.getByLabelText("Snapshot Date"), { target: { value: "2024-12-04" } });

    const table = screen.getByRole("table");
    expect(within(table).getAllByText("Occupied")).toHaveLength(2);
    expect(within(table).getAllByText("Vacant")).toHaveLength(1);
  });

  it("filters rent roll by property, occupancy, and search", async () => {
    renderApp();
    await screen.findByText("Rent Roll");

    fireEvent.change(screen.getByLabelText("Snapshot Date"), { target: { value: "2024-12-03" } });
    fireEvent.change(screen.getByLabelText("Property Filter"), { target: { value: "Sunset Gardens" } });
    fireEvent.change(screen.getByLabelText("Occupancy Filter"), { target: { value: "vacant" } });
    fireEvent.change(screen.getByLabelText("Rent Roll Search"), { target: { value: "P1-U01" } });

    const table = screen.getByRole("table");
    expect(within(table).getByText("P1-U01")).toBeInTheDocument();
    expect(within(table).queryByText("P1-U02")).toBeNull();
    expect(within(table).queryByText("P2-U01")).toBeNull();
  });

  it("updates KPIs after moving out a resident", async () => {
    renderApp();
    await screen.findByLabelText("Move Out Unit");
    await screen.findByTestId("kpi-card-Sunset-Gardens");

    fireEvent.change(screen.getByLabelText("Move Out Unit"), {
      target: { value: "Sunset Gardens::P1-U02" },
    });
    fireEvent.change(screen.getByLabelText("Move Out Date"), { target: { value: "2024-12-04" } });

    const moveOutButtons = screen.getAllByText("Move Out");
    fireEvent.click(moveOutButtons[moveOutButtons.length - 1]);

    await waitFor(() => {
      const sunsetCard = screen.getByTestId("kpi-card-Sunset-Gardens");
      expect(within(sunsetCard).getByText("50%")).toBeInTheDocument();
      expect(within(sunsetCard).getByText("$1,200")).toBeInTheDocument();
      expect(within(sunsetCard).getByText("Move-outs").parentElement).toHaveTextContent("Move-outs1");
    });
  });

  it("updates KPIs after moving in a resident", async () => {
    renderApp();
    await screen.findByLabelText("Move In Unit");
    await screen.findByTestId("kpi-card-Sunset-Gardens");

    fireEvent.change(screen.getByLabelText("Move In Unit"), {
      target: { value: "Sunset Gardens::P1-U01" },
    });
    fireEvent.change(screen.getByLabelText("Resident Name"), { target: { value: "New Resident" } });
    fireEvent.change(screen.getByLabelText("Move In Date"), { target: { value: "2024-12-04" } });
    fireEvent.change(screen.getByLabelText("Rent"), { target: { value: "1500" } });

    const moveInButtons = screen.getAllByText("Move In");
    fireEvent.click(moveInButtons[moveInButtons.length - 1]);

    await waitFor(() => {
      const sunsetCard = screen.getByTestId("kpi-card-Sunset-Gardens");
      expect(within(sunsetCard).getByText("$1,250")).toBeInTheDocument();
    });
  });
});
