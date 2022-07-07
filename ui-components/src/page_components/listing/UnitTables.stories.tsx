import * as React from "react"

import { UnitTables } from "./UnitTables"
import { StandardTable } from "../../tables/StandardTable"
import Archer from "../../../__tests__/fixtures/archer.json"
// import { unitSummariesTable } from "../../helpers/tableSummaries"
import { UnitGroupSummary, UnitType } from "@bloom-housing/backend-core/types"

export default {
  title: "Listing/Unit Tables",
}

const archer = Object.assign({}, Archer) as any

// copied from listings service output
const summaries: {
  byUnitType: UnitGroupSummary[]
  byUnitTypeWithoutFloor: UnitGroupSummary[]
  amiPercentages: string[]
  [key: string]: any
} = {
  unitTypes: ["studio"],
  priorityTypes: [],
  amiPercentages: ["45.0", "30.0"],
  byUnitType: [],
  byUnitTypeWithoutFloor: [],
  /* byUnitType: [
    {
      unitType: { name: "studio", numBedrooms: 1 } as UnitType,
      totalAvailable: 41,
      minIncomeRange: { min: "$1,438", max: "$2,208" },
      occupancyRange: { min: 1, max: 2 },
      rentAsPercentIncomeRange: { min: 10, max: 80 },
      rentRange: { min: "$719", max: "$1,104" },
      floorRange: { min: 2, max: 3 },
      areaRange: { min: 285, max: 285 },
    },
  ], */
  /* byUnitTypeWithoutFloor: [
    {
      unitType: { name: "studio", numBedrooms: 1 } as UnitType,
      totalAvailable: 41,
      minIncomeRange: { min: "$1,438", max: "$2,208" },
      occupancyRange: { min: 1, max: 2 },
      rentAsPercentIncomeRange: { min: 10, max: 80 },
      rentRange: { min: "$719", max: "$1,104" },
      areaRange: { min: 285, max: 285 },
    },
  ], */
  byAMI: [
    {
      percent: "45.0",
      byUnitType: [
        {
          unitType: { name: "studio", numBedrooms: 1 } as UnitType,
          totalAvailable: 24,
          minIncomeRange: { min: "$2,208", max: "$2,208" },
          occupancyRange: { min: 1, max: 2 },
          rentAsPercentIncomeRange: { min: null, max: null },
          rentRange: { min: "$1,104", max: "$1,104" },
          floorRange: { min: 2, max: 3 },
          areaRange: { min: 285, max: 285 },
        },
      ],
    },
    {
      percent: "30.0",
      byUnitType: [
        {
          unitType: { name: "studio", numBedrooms: 1 } as UnitType,
          totalAvailable: 16,
          minIncomeRange: { min: "$1,438", max: "$1,438" },
          occupancyRange: { min: 1, max: 2 },
          rentAsPercentIncomeRange: { min: null, max: null },
          rentRange: { min: "$719", max: "$719" },
          floorRange: { min: 2, max: 3 },
          areaRange: { min: 285, max: 285 },
        },
      ],
    },
  ],
  hmi: {
    columns: { householdSize: "Household Size", ami30: "30% AMI Units", ami45: "45% AMI Units" },
    rows: [
      { householdSize: 1, ami30: "$30,750", ami45: "$46,125" },
      { householdSize: 2, ami30: "$35,130", ami45: "$52,695" },
    ],
  },
}

export const unitListWithAccordion = () => {
  return <UnitTables units={archer.units} unitSummaries={summaries.byUnitType} />
}

export const unitListWithDisabledAccordion = () => {
  return (
    <UnitTables units={archer.units} unitSummaries={summaries.byUnitType} disableAccordion={true} />
  )
}

const unitSummariesHeaders = {
  unitType: "t.unitType",
  minimumIncome: "t.minimumIncome",
  rent: "t.rent",
  availability: "t.availability",
  totalCount: "t.totalCount",
}

const amiValues = summaries.amiPercentages
  ?.map((percent) => {
    const percentInt = parseInt(percent, 10)
    return percentInt
  })
  .sort()

export const unitSummarySections = () => {
  return (
    <div>
      {amiValues?.map((percent, index) => {
        const byAMI = summaries.byAMI.find((item: { percent: string }) => {
          return parseInt(item.percent, 10) == percent
        })
        return null
        /* return (
          <div key={index}>
            <h2 className="mt-4 mb-2">{percent}% AMI Unit</h2>
            <StandardTable
              headers={unitSummariesHeaders}
              data={unitSummariesTable(byAMI.byUnitTypeAndRent)}
              responsiveCollapse={true}
            />
          </div>
        ) */
      })}
    </div>
  )
}
