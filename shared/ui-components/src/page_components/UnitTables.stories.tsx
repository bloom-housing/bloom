import * as React from "react"
import { withA11y } from "@storybook/addon-a11y"
import UnitTables from "./UnitTables"
import { BasicTable } from "../tables/BasicTable"
import { GroupedTable } from "../tables/GroupedTable"
import Archer from "@bloom-housing/listings-service/listings/archer.json"
import { unitSummariesTable, groupNonReservedAndReservedSummaries } from "../helpers/tableSummaries"

export default {
  title: "Tables|UnitSummaryTables",
  decorators: [withA11y],
}

const archer = Object.assign({}, Archer) as any

// copied from listings service output
const summaries = {
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
      rentAsPercentIncomeRange: { min: null, max: null },
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
      rentAsPercentIncomeRange: { min: null, max: null },
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
      rentAsPercentIncomeRange: { min: null, max: null },
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
          rentAsPercentIncomeRange: { min: null, max: null },
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
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return <UnitTables units={archer.units} unitSummaries={summaries.byUnitType} />
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
}

export const unitsListWithoutFloor = () => {
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return <UnitTables units={archer.units} unitSummaries={summaries.byUnitTypeWithoutFloor} />
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
}

export const unitsListWithDisabledAccordion = () => {
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  return (
    // @ts-ignore
    <UnitTables units={archer.units} unitSummaries={summaries.byUnitType} disableAccordion={true} />
  )
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
}

const unitSummariesHeaders = {
  unitType: "Unit Type",
  minimumIncome: "Minimum Income",
  rent: "Rent",
  availability: "Availability",
}

const amiValues = summaries.amiPercentages
  .map((percent) => {
    const percentInt = parseInt(percent, 10)
    return percentInt
  })
  .sort()

export const unitsSummaries = () => {
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  return (
    <div>
      {amiValues.map((percent) => {
        const byAMI = summaries.byAMI.find((item) => {
          return parseInt(item.percent, 10) == percent
        })

        return (
          <div>
            <h2 className="mt-4 mb-2">{percent}% AMI Unit</h2>
            <BasicTable
              headers={unitSummariesHeaders}
              // @ts-ignore
              data={unitSummariesTable(byAMI.byNonReservedUnitType)}
              responsiveCollapse={true}
            />
          </div>
        )
      })}
    </div>
  )
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
}

export const unitsSummariesGroupedByReservedTypes = () => {
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  return (
    <div>
      {amiValues.map((percent) => {
        const byAMI = summaries.byAMI.find((item) => {
          return parseInt(item.percent, 10) == percent
        })

        if (byAMI) {
          const groupedUnits = groupNonReservedAndReservedSummaries(
            // @ts-ignore
            byAMI.byNonReservedUnitType,
            byAMI.byReservedType
          )

          return (
            <div>
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
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
}
