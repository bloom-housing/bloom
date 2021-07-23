import t from "../helpers/translator"
import React from "react"

import { ResponsiveTable } from "./ResponsiveTable"
import { Row, HeaderCell } from "./StandardTable"

export default {
  title: "Tables/ResponsiveTable",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

const header = (
  <>
    <HeaderCell className="uppercase">Units</HeaderCell>
    <HeaderCell className="uppercase md:hidden">Availability</HeaderCell>
    <HeaderCell className="uppercase">Income Range</HeaderCell>
    <HeaderCell className="uppercase">Rent</HeaderCell>
  </>
)

const rows = [
  <>
    <td>
      <p className="font-semibold">Studio</p>
      <p className="text-sm text-gray-700 hidden md:block">Waitlist</p>
    </td>
    <td className="md:hidden">
      <p className="font-semibold">1</p>
      <p className="text-sm text-gray-700">available</p>
    </td>
    <td>
      <p className="font-semibold">$0 to $6,854</p>
      <p className="text-sm text-gray-700">per month</p>
    </td>
    <td>
      <p className="font-semibold">30%</p>
      <p className="text-sm text-gray-700">income</p>
    </td>
  </>,
  <>
    <td>
      <p className="font-semibold">1BR</p>
      <p className="text-sm text-gray-700 hidden md:block">Waitlist</p>
    </td>
    <td className="md:hidden">
      <p className="font-semibold">Waitlist</p>
    </td>
    <td>
      <p className="font-semibold">$0 to $6,854</p>
      <p className="text-sm text-gray-700">per month</p>
    </td>
    <td>
      <p className="font-semibold">30%</p>
      <p className="text-sm text-gray-700">income</p>
    </td>
  </>,
]

export const Default = () => <ResponsiveTable header={header} rows={rows}></ResponsiveTable>
