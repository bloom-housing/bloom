import React from "react"

import { CategoryTable } from "./CategoryTable"
import { TableHeaders } from "./StandardTable"

export default {
  title: "Tables/CategoryTable",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  component: CategoryTable,
}

const responsiveTableRows = [
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

const responsiveTableHeaders: TableHeaders = {
  units: { name: "t.unitType" },
  income: { name: "t.income" },
  rent: { name: "t.rent" },
}

const longerRows = [
  {
    units: { cellText: "Studio", cellSubText: "Waitlist (Listahan ng mga Naghih intay)" },
    income: { cellText: "$3,638 hanggang $6,216", cellSubText: "kada buwan" },
    rent: { cellText: "$1,819", cellSubText: " kada buwan" },
  },
  {
    units: { cellText: "Studio", cellSubText: "Waitlist (Listahan ng mga Naghih intay)" },
    income: { cellText: "$3,638 hanggang $6,216", cellSubText: "kada buwan" },
    rent: { cellText: "$1,819", cellSubText: " kada buwan" },
  },
]

const longerHeaders: TableHeaders = {
  units: { name: "MGA UNIT" },
  income: { name: "HANAY NG KITA" },
  rent: { name: "UPA" },
}

export const Basic = () => (
  <CategoryTable
    categoryData={[
      {
        header: "Header 1",
        tableData: { stackedData: responsiveTableRows, headers: responsiveTableHeaders },
      },
      {
        header: "Header 2",
        tableData: { stackedData: responsiveTableRows, headers: responsiveTableHeaders },
      },
    ]}
  />
)

export const LongerStrings = () => (
  <CategoryTable
    categoryData={[
      {
        header: "Header 1 but it's a long string",
        tableData: { stackedData: longerRows, headers: longerHeaders },
      },
      {
        header: "Header 2 but it's a long string",
        tableData: { stackedData: longerRows, headers: longerHeaders },
      },
    ]}
  />
)

export const SmallerContainer = () => {
  return (
    <div style={{ maxWidth: "500px" }}>
      <CategoryTable
        categoryData={[
          {
            header: "Header 1 but it's a long string",
            tableData: { stackedData: longerRows, headers: longerHeaders },
          },
          {
            header: "Header 2 but it's a long string",
            tableData: { stackedData: longerRows, headers: longerHeaders },
          },
        ]}
      />
    </div>
  )
}
