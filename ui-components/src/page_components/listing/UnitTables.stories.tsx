import * as React from "react"

import { UnitTables } from "./UnitTables"
import { StandardTable } from "../../tables/StandardTable"
import { GroupedTable } from "../../tables/GroupedTable"
import Archer from "../../../__tests__/fixtures/archer.json"
import {
  unitSummariesTable,
  groupNonReservedAndReservedSummaries,
} from "../../helpers/tableSummaries"
import { UnitSummary } from "@bloom-housing/backend-core/types"

export default {
  title: "Listing/Unit Summary Tables",
}

const archer = Object.assign({}, Archer) as any

// copied from listings service output
const summaries: {
  byUnitType: UnitSummary[]
  byUnitTypeWithoutFloor: UnitSummary[]
  amiPercentages: string[]
  [key: string]: any
} = {
  unitTypes: ["studio"],
  reservedTypes: ["senior"],
  priorityTypes: [],
  amiPercentages: ["45.0", "30.0"],
  byUnitType: [
    {
      unitType: "studio",
      totalAvailable: 41,
      minIncomeRange: { min: "$1,438", max: "$2,208" },
      occupancyRange: { min: 1, max: 2 },
      rentAsPercentIncomeRange: { min: 10, max: 80 },
      rentRange: { min: "$719", max: "$1,104" },
      floorRange: { min: 2, max: 3 },
      areaRange: { min: 285, max: 285 },
    },
  ],
  byUnitTypeWithoutFloor: [
    {
      unitType: "studio",
      totalAvailable: 41,
      minIncomeRange: { min: "$1,438", max: "$2,208" },
      occupancyRange: { min: 1, max: 2 },
      rentAsPercentIncomeRange: { min: 10, max: 80 },
      rentRange: { min: "$719", max: "$1,104" },
      areaRange: { min: 285, max: 285 },
    },
  ],
  byNonReservedUnitType: [
    {
      unitType: "studio",
      totalAvailable: 40,
      minIncomeRange: { min: "$1,438", max: "$2,208" },
      occupancyRange: { min: 1, max: 2 },
      rentAsPercentIncomeRange: { min: 1, max: 2 },
      rentRange: { min: "$719", max: "$1,104" },
      floorRange: { min: 2, max: 3 },
      areaRange: { min: 285, max: 285 },
    },
  ],
  byReservedType: [
    {
      reservedType: "senior",
      byUnitType: [
        {
          unitType: "studio",
          totalAvailable: 1,
          minIncomeRange: { min: "$2,208", max: "$2,208" },
          occupancyRange: { min: 1, max: 2 },
          rentAsPercentIncomeRange: { min: 1, max: 2 },
          rentRange: { min: "$1,104", max: "$1,104" },
          floorRange: { min: 2, max: 2 },
          areaRange: { min: 285, max: 285 },
        },
      ],
    },
  ],
  byAMI: [
    {
      percent: "45.0",
      byNonReservedUnitType: [
        {
          unitType: "studio",
          totalAvailable: 24,
          minIncomeRange: { min: "$2,208", max: "$2,208" },
          occupancyRange: { min: 1, max: 2 },
          rentAsPercentIncomeRange: { min: null, max: null },
          rentRange: { min: "$1,104", max: "$1,104" },
          floorRange: { min: 2, max: 3 },
          areaRange: { min: 285, max: 285 },
        },
      ],
      byReservedType: [
        {
          reservedType: "senior",
          byUnitType: [
            {
              unitType: "studio",
              totalAvailable: 1,
              minIncomeRange: { min: "$2,208", max: "$2,208" },
              occupancyRange: { min: 1, max: 2 },
              rentAsPercentIncomeRange: { min: null, max: null },
              rentRange: { min: "$1,104", max: "$1,104" },
              floorRange: { min: 2, max: 2 },
              areaRange: { min: 285, max: 285 },
            },
          ],
        },
      ],
    },
    {
      percent: "30.0",
      byNonReservedUnitType: [
        {
          unitType: "studio",
          totalAvailable: 16,
          minIncomeRange: { min: "$1,438", max: "$1,438" },
          occupancyRange: { min: 1, max: 2 },
          rentAsPercentIncomeRange: { min: null, max: null },
          rentRange: { min: "$719", max: "$719" },
          floorRange: { min: 2, max: 3 },
          areaRange: { min: 285, max: 285 },
        },
      ],
      byReservedType: [],
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

export const unitsList = () => {
  return <UnitTables units={archer.units} unitSummaries={summaries.byUnitType} />
}

export const unitsListWithoutFloor = () => {
  return <UnitTables units={archer.units} unitSummaries={summaries.byUnitTypeWithoutFloor} />
}

export const unitsListWithDisabledAccordion = () => {
  return (
    <UnitTables units={archer.units} unitSummaries={summaries.byUnitType} disableAccordion={true} />
  )
}

const unitSummariesHeaders = {
  unitType: "t.unitType",
  minimumIncome: "t.minimumIncome",
  rent: "t.rent",
  availability: "t.availability",
}

const amiValues = summaries.amiPercentages
  .map((percent) => {
    const percentInt = parseInt(percent, 10)
    return percentInt
  })
  .sort()

export const unitsSummaries = () => {
  return (
    <div>
      {amiValues.map((percent, index) => {
        const byAMI = summaries.byAMI.find((item: { percent: string }) => {
          return parseInt(item.percent, 10) == percent
        })

        return (
          <div key={index}>
            <h2 className="mt-4 mb-2">{percent}% AMI Unit</h2>
            <StandardTable
              headers={unitSummariesHeaders}
              data={unitSummariesTable(byAMI.byNonReservedUnitType)}
              responsiveCollapse={true}
            />
          </div>
        )
      })}
    </div>
  )
}

export const unitsSummariesGroupedByReservedTypes = () => {
  return (
    <div>
      {amiValues.map((percent, index) => {
        const byAMI = summaries.byAMI.find((item: { percent: string }) => {
          return parseInt(item.percent, 10) == percent
        })

        if (byAMI) {
          const groupedUnits = groupNonReservedAndReservedSummaries(
            byAMI.byNonReservedUnitType,
            byAMI.byReservedType
          )

          return (
            <div key={index}>
              <h2 className="mt-4 mb-2">{percent}% AMI Unit</h2>
              <GroupedTable
                headers={unitSummariesHeaders}
                data={groupedUnits}
                responsiveCollapse={true}
              />
            </div>
          )
        } else {
          return null
        }
      })}
    </div>
  )
}
