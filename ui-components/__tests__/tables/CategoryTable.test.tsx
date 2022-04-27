import React from "react"
import { render, cleanup } from "@testing-library/react"
import { CategoryTable } from "../../src/tables/CategoryTable"

afterEach(cleanup)

const rows = [
  {
    units: { cellText: "Studio", cellSubText: "23 available" },
    income: { cellText: "Up to $6,854", cellSubText: "per month" },
    rent: { cellText: "30%", cellSubText: "income" },
  },
  {
    units: { cellText: "1 BR", cellSubText: "3 available" },
    income: { cellText: "$2,194 to $6,854", cellSubText: "per month" },
    rent: { cellText: "$1,295", cellSubText: "income" },
  },
]

const headers = {
  units: { name: "t.unitType" },
  income: { name: "t.income" },
  rent: { name: "t.rent" },
}

describe("<CategoryTable>", () => {
  it("renders table data", () => {
    const { getAllByText } = render(
      <CategoryTable
        categoryData={[
          {
            header: "Header 1",
            tableData: { stackedData: rows, headers: headers },
          },
          {
            header: "Header 2",
            tableData: { stackedData: rows, headers: headers },
          },
        ]}
      />
    )
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
    expect(getAllByText("Header 1"))
    expect(getAllByText("Header 2"))
  })
})
