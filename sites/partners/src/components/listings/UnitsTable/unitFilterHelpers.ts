import { t } from "@bloom-housing/ui-components"
import {
  Unit,
  UnitAccessibilityPriorityTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { UnitTypeSort } from "@bloom-housing/shared-helpers/src/utilities/unitTypes"

export const NONE_OPTION = "none"
export const MIN_OPTIONS_TO_SHOW = 2

export type CheckboxFilterKey = "unitTypes" | "amiCharts" | "amiPercentages" | "accessibilityTypes"
export type RangeFilterKey = "rent" | "sqFeet"
export type NumberRange = { min?: number; max?: number }

export type UnitFilters = Record<CheckboxFilterKey, string[]> & Record<RangeFilterKey, NumberRange>

type FilterOption = { value: string; label: string }
export type UnitFilterOptions = Record<CheckboxFilterKey, FilterOption[]>

const CHECKBOX_FILTER_KEYS: CheckboxFilterKey[] = [
  "unitTypes",
  "amiCharts",
  "amiPercentages",
  "accessibilityTypes",
]

export const emptyUnitFilters: UnitFilters = {
  unitTypes: [],
  amiCharts: [],
  amiPercentages: [],
  accessibilityTypes: [],
  rent: {},
  sqFeet: {},
}

export const parseNumber = (value?: string | number | null): number | undefined => {
  const parsed = parseFloat(String(value ?? "").replace(/,/g, ""))
  return Number.isNaN(parsed) ? undefined : parsed
}

const unitCheckboxValue: Record<CheckboxFilterKey, (unit: Unit) => string> = {
  unitTypes: (unit) => unit.unitTypes?.name ?? NONE_OPTION,
  amiCharts: (unit) => unit.amiChart?.id || NONE_OPTION,
  amiPercentages: (unit) => {
    const percentage = parseNumber(unit.amiPercentage)
    return percentage === undefined ? NONE_OPTION : String(percentage)
  },
  accessibilityTypes: (unit) => unit.accessibilityPriorityType ?? NONE_OPTION,
}

const accessibilityOrder: string[] = Object.values(UnitAccessibilityPriorityTypeEnum)

const rankIn = (order: string[]) => (value: string) => {
  const index = order.indexOf(value)
  return index === -1 ? order.length : index
}

const sortValues = (values: string[], compare: (a: string, b: string) => number) =>
  [...values].sort((a, b) => {
    if (a === NONE_OPTION) return 1
    if (b === NONE_OPTION) return -1
    return compare(a, b)
  })

export const buildUnitFilterOptions = (units: Unit[]): UnitFilterOptions => {
  const distinct = (key: CheckboxFilterKey) =>
    Array.from(new Set(units.map((unit) => unitCheckboxValue[key](unit))))

  const chartNames = new Map<string, string>()
  units.forEach((unit) => {
    const id = unit.amiChart?.id
    if (id && (unit.amiChart.name || !chartNames.has(id))) {
      chartNames.set(id, unit.amiChart.name || id)
    }
  })

  const unitTypeRank = rankIn(UnitTypeSort)
  const accessibilityRank = rankIn(accessibilityOrder)

  return {
    unitTypes: sortValues(distinct("unitTypes"), (a, b) => unitTypeRank(a) - unitTypeRank(b)).map(
      (value) => ({
        value,
        label: value === NONE_OPTION ? t("t.none") : t(`listings.unitTypes.${value}`),
      })
    ),
    amiCharts: sortValues(distinct("amiCharts"), (a, b) =>
      chartNames.get(a).localeCompare(chartNames.get(b), undefined, { numeric: true })
    ).map((value) => ({
      value,
      label: value === NONE_OPTION ? t("t.none") : chartNames.get(value),
    })),
    amiPercentages: sortValues(
      distinct("amiPercentages"),
      (a, b) => parseFloat(a) - parseFloat(b)
    ).map((value) => ({
      value,
      label: value === NONE_OPTION ? t("t.none") : `${value}%`,
    })),
    accessibilityTypes: sortValues(
      distinct("accessibilityTypes"),
      (a, b) => accessibilityRank(a) - accessibilityRank(b)
    ).map((value) => ({
      value,
      label: value === NONE_OPTION ? t("t.n/a") : t(`listings.unit.accessibilityType.${value}`),
    })),
  }
}

const isRangeSet = (range: NumberRange) => range.min !== undefined || range.max !== undefined

const isInRange = (value: number | undefined, range: NumberRange) => {
  if (!isRangeSet(range)) return true
  if (value === undefined) return false
  return (
    (range.min === undefined || value >= range.min) &&
    (range.max === undefined || value <= range.max)
  )
}

const unitMatchesFilters = (unit: Unit, filters: UnitFilters) =>
  CHECKBOX_FILTER_KEYS.every(
    (key) => !filters[key].length || filters[key].includes(unitCheckboxValue[key](unit))
  ) &&
  isInRange(parseNumber(unit.monthlyRent), filters.rent) &&
  isInRange(parseNumber(unit.sqFeet), filters.sqFeet)

export const applyUnitFilters = <T extends Unit>(units: T[], filters: UnitFilters): T[] =>
  units.filter((unit) => unitMatchesFilters(unit, filters))

export const isUnitFilterActive = (filters: UnitFilters) =>
  CHECKBOX_FILTER_KEYS.some((key) => filters[key].length > 0) ||
  isRangeSet(filters.rent) ||
  isRangeSet(filters.sqFeet)

export const pruneUnitFilters = (filters: UnitFilters, options: UnitFilterOptions): UnitFilters => {
  let changed = false
  const next = { ...filters }

  CHECKBOX_FILTER_KEYS.forEach((key) => {
    const available =
      options[key].length >= MIN_OPTIONS_TO_SHOW ? options[key].map((option) => option.value) : []
    const kept = filters[key].filter((value) => available.includes(value))
    if (kept.length !== filters[key].length) {
      next[key] = kept
      changed = true
    }
  })

  return changed ? next : filters
}
