import React from "react"
import {
  CellContext,
  ColumnDef,
  FilterFn,
  SortingFn,
  createColumnHelper,
} from "@tanstack/react-table"
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
import { parseNumber } from "./UnitsTable/unitFilterHelpers"
import styles from "./UnitTableColDefs.module.scss"

export const unitToRow = (unit: Unit & { tempId?: number }): TableDataRow => ({
  id: unit.id,
  tempId: unit.tempId,
  number: unit.number || undefined,
  unitType: unit.unitTypes ? [unit.unitTypes.name] : undefined,
  amiChart: unit.amiChart?.name || undefined,
  amiPercentage: unit.amiPercentage || undefined,
  monthlyRent: unit.monthlyRent || undefined,
  sqFeet: unit.sqFeet || undefined,
  accessibilityPriorityType: unit.accessibilityPriorityType || undefined,
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

const formatPlain = (value: unknown) => (value == null ? "" : String(value))

const formatUnitTypes = (value: unknown) =>
  ((value as string[] | undefined) ?? []).map((name) => t(`listings.unitTypes.${name}`)).join(", ")

const formatRent = (value: unknown) => {
  const rent = formatPlain(value)
  return rent ? `$${rent}` : ""
}

const formatAccessibility = (value: unknown) =>
  value ? t(`listings.unit.accessibilityType.${value as string}`) : t("t.n/a")

const unitCellText: Record<string, (value: unknown) => string> = {
  number: formatPlain,
  unitType: formatUnitTypes,
  amiChart: formatPlain,
  amiPercentage: formatPlain,
  monthlyRent: formatRent,
  sqFeet: formatPlain,
  accessibilityPriorityType: formatAccessibility,
}

export const unitGlobalFilterFn: FilterFn<TableDataRow> = (row, columnId, filterValue) => {
  const format = unitCellText[columnId]
  if (!format) return false
  return format(row.getValue(columnId))
    .toLowerCase()
    .includes(String(filterValue).trim().toLowerCase())
}

const compareText = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })

const sortNaturally: SortingFn<TableDataRow> = (rowA, rowB, columnId) =>
  compareText(formatPlain(rowA.getValue(columnId)), formatPlain(rowB.getValue(columnId)))

const sortNumerically: SortingFn<TableDataRow> = (rowA, rowB, columnId) => {
  const a = parseNumber(rowA.getValue<string>(columnId))
  const b = parseNumber(rowB.getValue<string>(columnId))
  if (a === undefined || b === undefined) return sortNaturally(rowA, rowB, columnId)
  return a - b
}

const sortByAccessibilityText: SortingFn<TableDataRow> = (rowA, rowB, columnId) =>
  compareText(
    formatAccessibility(rowA.getValue(columnId)),
    formatAccessibility(rowB.getValue(columnId))
  )

const unitTypeRank = (names: string[] | undefined): number => {
  const ranks = (names ?? [])
    .map((name) => UnitTypeSort.indexOf(name))
    .filter((rank) => rank !== -1)

  return ranks.length ? Math.min(...ranks) : -1
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
  wrapHeader?: boolean
}

const textColumn = (
  id: string,
  headerKey: string,
  { cell, sortable = false, sortingFn, size, wrapHeader = false }: TextColumnOptions = {}
) =>
  columnHelper.accessor(id, {
    id,
    cell: cell ?? ((props) => props.getValue()),
    header: () => (
      <span className={styles[wrapHeader ? "wrap-header" : "no-wrap-header"]}>{t(headerKey)}</span>
    ),
    enableColumnFilter: false,
    enableSorting: sortable,
    sortDescFirst: false,
    sortingFn,
    sortUndefined: -1,
    size,
    minSize: size,
    meta: {
      plaintextName: t(headerKey),
      disableTruncate: true,
    },
  })

const unitColumn = (id: string, headerKey: string, options: TextColumnOptions = {}) =>
  textColumn(id, headerKey, {
    cell: (props) => unitCellText[id](props.getValue()),
    ...options,
  })

const unitTypeColumn = () =>
  unitColumn("unitType", "listings.unit.type", {
    sortable: true,
    sortingFn: sortByUnitTypeOrder,
  })

const actionColumn = (actionsCell: (row: TableDataRow) => React.ReactNode) =>
  columnHelper.display({
    id: "action",
    header: () => <span className="sr-only">{t("t.actions")}</span>,
    cell: (props) => actionsCell(props.row.original),
    enableColumnFilter: false,
    enableSorting: false,
    size: 80,
    minSize: 80,
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
        unitColumn("number", "listings.unit.number", {
          sortable: true,
          sortingFn: sortNaturally,
        }),
        unitTypeColumn(),
        unitColumn("amiChart", "listings.unit.amiChart", {
          sortable: true,
          sortingFn: sortNaturally,
        }),
        unitColumn("amiPercentage", "t.ami", {
          sortable: true,
          sortingFn: sortNumerically,
        }),
        unitColumn("monthlyRent", "listings.unit.rent", {
          sortable: true,
          sortingFn: sortNumerically,
        }),
        unitColumn("sqFeet", "listings.unit.sqft", {
          sortable: true,
          sortingFn: sortNumerically,
        }),
        unitColumn("accessibilityPriorityType", "listings.unit.accessibilityPriorityType", {
          sortable: true,
          sortingFn: sortByAccessibilityText,
          wrapHeader: true,
        }),
      ]

  if (actionsCell) {
    columns.push(actionColumn(actionsCell))
  }

  return disableSorting ? columns.map((column) => ({ ...column, enableSorting: false })) : columns
}
