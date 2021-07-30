import t from "../helpers/translator"
import React from "react"

import { ResponsiveTable } from "./ResponsiveTable"
import { Row, HeaderCell } from "./StandardTable"

export default {
  title: "Tables/ResponsiveTable",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

const pricingHeaders = {
  units: "t.units",
  availability: { name: "t.availability", className: "md:hidden" },
  income: "t.income",
  rent: "t.rent",
}

const pricingRows = [
  {
    units: (
      <>
        <p className="font-semibold">Studio</p>
        <p className="text-sm text-gray-700 hidden md:block">Waitlist</p>
      </>
    ),
    availability: (
      <div className="md:hidden">
        <p className="font-semibold">1</p>
        <p className="text-sm text-gray-700">available</p>
      </div>
    ),
    income: (
      <>
        <p className="font-semibold">$0 to $6,854</p>
        <p className="text-sm text-gray-700">per month</p>
      </>
    ),
    rent: (
      <>
        <p className="font-semibold">30%</p>
        <p className="text-sm text-gray-700">income</p>
      </>
    ),
  },
  {
    units: (
      <>
        <p className="font-semibold">Studio</p>
        <p className="text-sm text-gray-700 hidden md:block">Waitlist</p>
      </>
    ),
    availability: (
      <div className="md:hidden">
        <p className="font-semibold">1</p>
        <p className="text-sm text-gray-700">available</p>
      </div>
    ),
    income: (
      <>
        <p className="font-semibold">$0 to $6,854</p>
        <p className="text-sm text-gray-700">per month</p>
      </>
    ),
    rent: (
      <>
        <p className="font-semibold">30%</p>
        <p className="text-sm text-gray-700">income</p>
      </>
    ),
  },
]
export const Default = () => <ResponsiveTable headers={pricingHeaders} data={pricingRows} />
