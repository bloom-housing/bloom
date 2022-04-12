import React from "react"
import { render, cleanup } from "@testing-library/react"
import { StackedTable } from "../../src/tables/StackedTable"

afterEach(cleanup)

const headers = {
  units: { name: "t.unitType" },
  availability: { name: "t.availability" },
  income: { name: "t.incomeRange" },
  rent: { name: "t.rent" },
}

const rows = [
  {
    units: { cellText: "Studio", cellSubText: "23 available", hideSubTextMobile: true },
    availability: { cellText: "23", cellSubText: "available" },
    income: { cellText: "$0 to $6,854", cellSubText: "per month" },
    rent: { cellText: "30%", cellSubText: "income" },
  },
  {
    units: { cellText: "1 BR", cellSubText: "3 available" },
    availability: { cellText: "3", cellSubText: "available" },
    income: { cellText: "$2,194 to $6,854", cellSubText: "per month" },
    rent: { cellText: "$1,295", cellSubText: "income" },
  },
]
describe("<StackedTable>", () => {
  it("renders table data", () => {
    const { getAllByText } = render(<StackedTable stackedData={rows} headers={headers} />)
    expect(getAllByText(rows[0].units.cellText))
    expect(getAllByText(rows[0].income.cellText))
    expect(getAllByText(rows[0].rent.cellText))
    expect(getAllByText(rows[1].units.cellText))
    expect(getAllByText(rows[1].income.cellText))
    expect(getAllByText(rows[1].rent.cellText))
    expect(getAllByText(rows[0].units.cellSubText))
    expect(getAllByText(rows[0].income.cellSubText))
    expect(getAllByText(rows[0].rent.cellSubText))
    expect(getAllByText(rows[1].units.cellSubText))
    expect(getAllByText(rows[1].income.cellSubText))
    expect(getAllByText(rows[1].rent.cellSubText))
  })
})
