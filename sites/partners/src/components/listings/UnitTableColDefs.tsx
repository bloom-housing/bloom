import React from "react"
import { CellContext, ColumnDef, SortingFn, createColumnHelper } from "@tanstack/react-table"
import { t } from "@bloom-housing/ui-components"
import {
  EnumUnitGroupAmiLevelMonthlyRentDeterminationType,
  MinMax,
  RentTypeEnum,
  Unit,
  UnitGroup,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { UnitTypeSort } from "@bloom-housing/shared-helpers/src/utilities/unitTypes"
import { TableDataRow } from "../shared/DataTable"
import { formatRange, formatRentRange, minMaxFinder } from "./helpers"

export const unitToRow = (unit: Unit & { tempId?: number }): TableDataRow => ({
  id: unit.id,
  tempId: unit.tempId,
  number: unit.number,
  unitType: unit.unitTypes ? [unit.unitTypes.name] : [],
  amiPercentage: unit.amiPercentage,
  monthlyRent: unit.monthlyRent,
  sqFeet: unit.sqFeet,
  accessibilityPriorityType: unit.accessibilityPriorityType
    ? t(`listings.unit.accessibilityType.${unit.accessibilityPriorityType}`)
    : t("t.n/a"),
})

export const unitGroupToRow = (
  unitGroup: UnitGroup & { tempId?: number },
  showNonRegulated: boolean
): TableDataRow => {
  const unitType = unitGroup.unitTypes?.map((type) => type.name) ?? []

  if (showNonRegulated) {
    const rentValue =
      unitGroup.rentType === RentTypeEnum.fixedRent
        ? unitGroup.monthlyRent
        : formatRange(unitGroup.flatRentValueFrom, unitGroup.flatRentValueTo)

    return {
      id: unitGroup.id,
      tempId: unitGroup.tempId,
      unitType,
      number: unitGroup.totalCount,
      monthlyRent: rentValue,
      occupancy: formatRange(unitGroup.minOccupancy, unitGroup.maxOccupancy),
      bath: formatRange(unitGroup.bathroomMin, unitGroup.bathroomMax),
    }
  }

  let amiRange: MinMax, rentRange: MinMax, percentIncomeRange: MinMax

  unitGroup.unitGroupAmiLevels.forEach((ami) => {
    if (ami.amiPercentage) {
      amiRange = minMaxFinder(amiRange, ami.amiPercentage)
    }
    if (
      ami.flatRentValue &&
      ami.monthlyRentDeterminationType ===
        EnumUnitGroupAmiLevelMonthlyRentDeterminationType.flatRent
    ) {
      rentRange = minMaxFinder(rentRange, ami.flatRentValue)
    }
    if (
      ami.percentageOfIncomeValue &&
      ami.monthlyRentDeterminationType ===
        EnumUnitGroupAmiLevelMonthlyRentDeterminationType.percentageOfIncome
    ) {
      percentIncomeRange = minMaxFinder(percentIncomeRange, ami.percentageOfIncomeValue)
    }
  })

  return {
    id: unitGroup.id,
    tempId: unitGroup.tempId,
    unitType,
    number: unitGroup.totalCount,
    amiPercentage: amiRange && formatRange(amiRange.min, amiRange.max, "", "%"),
    monthlyRent: formatRentRange(rentRange, percentIncomeRange),
    occupancy: formatRange(unitGroup.minOccupancy, unitGroup.maxOccupancy),
    sqFeet: formatRange(unitGroup.sqFeetMin, unitGroup.sqFeetMax),
    bath: formatRange(unitGroup.bathroomMin, unitGroup.bathroomMax),
  }
}

const columnHelper = createColumnHelper<TableDataRow>()

const unitTypeRank = (names: string[]): number => {
  const ranks = names.map((name) => UnitTypeSort.indexOf(name)).filter((rank) => rank !== -1)

  return ranks.length ? Math.min(...ranks) : Number.POSITIVE_INFINITY
}

const sortByUnitTypeOrder: SortingFn<TableDataRow> = (rowA, rowB, columnId) => {
  const a = unitTypeRank(rowA.getValue<string[]>(columnId))
  const b = unitTypeRank(rowB.getValue<string[]>(columnId))

  if (a === b) return 0
  return a < b ? -1 : 1
}

type UnitColumnOptions = {
  enableUnitGroups: boolean
  showNonRegulated: boolean
  disableSorting?: boolean
  actionsCell?: (row: TableDataRow) => React.ReactNode
}

type TextColumnOptions = {
  cell?: (props: CellContext<TableDataRow, unknown>) => React.ReactNode
  sortable?: boolean
  sortingFn?: SortingFn<TableDataRow>
  size?: number
}

const textColumn = (
  id: string,
  headerKey: string,
  { cell, sortable = false, sortingFn, size }: TextColumnOptions = {}
) =>
  columnHelper.accessor(id, {
    id,
    cell: cell ?? ((props) => props.getValue()),
    header: () => t(headerKey),
    enableColumnFilter: false,
    enableSorting: sortable,
    sortDescFirst: false,
    sortingFn,
    size,
    minSize: size,
    meta: {
      plaintextName: t(headerKey),
      disableTruncate: true,
    },
  })

const unitTypeColumn = () =>
  textColumn("unitType", "listings.unit.type", {
    cell: (props) =>
      props
        .getValue<string[]>()
        .map((name) => t(`listings.unitTypes.${name}`))
        .join(", "),
    sortable: true,
    sortingFn: sortByUnitTypeOrder,
    size: 150,
  })

const actionColumn = (actionsCell: (row: TableDataRow) => React.ReactNode) =>
  columnHelper.display({
    id: "action",
    header: () => <span className="sr-only">{t("t.actions")}</span>,
    cell: (props) => actionsCell(props.row.original),
    enableColumnFilter: false,
    enableSorting: false,
    size: 90,
    minSize: 90,
    meta: { disableTruncate: true },
  })

export const getUnitColumns = ({
  enableUnitGroups,
  showNonRegulated,
  disableSorting,
  actionsCell,
}: UnitColumnOptions): ColumnDef<TableDataRow>[] => {
  const columns: ColumnDef<TableDataRow>[] = enableUnitGroups
    ? [
        unitTypeColumn(),
        textColumn("number", "listings.unit.totalCount", { size: 70 }),
        ...(showNonRegulated ? [] : [textColumn("amiPercentage", "t.ami", { size: 100 })]),
        textColumn("monthlyRent", "listings.unit.rent", { size: 130 }),
        textColumn("occupancy", "listings.unit.occupancy", { size: 90 }),
        ...(showNonRegulated ? [] : [textColumn("sqFeet", "listings.unit.sqft", { size: 90 })]),
        textColumn("bath", "listings.unit.bath", { size: 70 }),
      ]
    : [
        textColumn("number", "listings.unit.number", { size: 90 }),
        unitTypeColumn(),
        textColumn("amiPercentage", "t.ami", { size: 70 }),
        textColumn("monthlyRent", "listings.unit.rent", { size: 100 }),
        textColumn("sqFeet", "listings.unit.sqft", { size: 80 }),
        textColumn("accessibilityPriorityType", "listings.unit.accessibilityPriorityType", {
          size: 230,
        }),
      ]

  if (actionsCell) {
    columns.push(actionColumn(actionsCell))
  }

  return disableSorting ? columns.map((column) => ({ ...column, enableSorting: false })) : columns
}
