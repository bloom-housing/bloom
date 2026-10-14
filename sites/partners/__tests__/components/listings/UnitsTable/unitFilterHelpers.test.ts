import { t } from "@bloom-housing/ui-components"
import { unit, unitTypes } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  AmiChart,
  Unit,
  UnitAccessibilityPriorityTypeEnum,
  UnitTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  applyUnitFilters,
  buildUnitFilterOptions,
  emptyUnitFilters,
  isUnitFilterActive,
  NONE_OPTION,
  pruneUnitFilters,
  UnitFilters,
} from "../../../../src/components/listings/UnitsTable/unitFilterHelpers"

// unitTypes fixture order: studio, oneBdrm, twoBdrm, ...
const [studioType, oneBdrmType, twoBdrmType] = unitTypes
const bondChart = { id: "chart-bond", name: "2026 Bond" } as AmiChart
const hudChart = { id: "chart-hud", name: "2026 CRA-HUD" } as AmiChart

const makeUnit = (overrides: Partial<Unit>): Unit => ({ ...unit, ...overrides })

const unitA = makeUnit({
  id: "a",
  number: "10",
  unitTypes: oneBdrmType,
  amiChart: bondChart,
  amiPercentage: "30.0",
  monthlyRent: "1200",
  sqFeet: "600",
  accessibilityPriorityType: UnitAccessibilityPriorityTypeEnum.mobility,
})
const unitB = makeUnit({
  id: "b",
  number: "2",
  unitTypes: studioType,
  amiChart: hudChart,
  amiPercentage: "50",
  monthlyRent: "900",
  sqFeet: "400",
  accessibilityPriorityType: undefined,
})
const unitC = makeUnit({
  id: "c",
  number: "4A",
  unitTypes: twoBdrmType,
  amiChart: undefined,
  amiPercentage: "80",
  monthlyRent: undefined,
  sqFeet: "1,050",
  accessibilityPriorityType: UnitAccessibilityPriorityTypeEnum.hearing,
})
const units = [unitA, unitB, unitC]

const withFilters = (overrides: Partial<UnitFilters>): UnitFilters => ({
  ...emptyUnitFilters,
  ...overrides,
})
const ids = (list: Unit[]) => list.map((item) => item.id)

describe("buildUnitFilterOptions", () => {
  it("builds options only from values present in the units, in display order", () => {
    const options = buildUnitFilterOptions(units)

    expect(options.unitTypes).toEqual([
      { value: UnitTypeEnum.studio, label: t("listings.unitTypes.studio") },
      { value: UnitTypeEnum.oneBdrm, label: t("listings.unitTypes.oneBdrm") },
      { value: UnitTypeEnum.twoBdrm, label: t("listings.unitTypes.twoBdrm") },
    ])
    expect(options.amiCharts).toEqual([
      { value: "chart-bond", label: "2026 Bond" },
      { value: "chart-hud", label: "2026 CRA-HUD" },
      { value: NONE_OPTION, label: t("t.none") },
    ])
    expect(options.amiPercentages).toEqual([
      { value: "30", label: "30%" },
      { value: "50", label: "50%" },
      { value: "80", label: "80%" },
    ])
    expect(options.accessibilityTypes).toEqual([
      { value: "mobility", label: t("listings.unit.accessibilityType.mobility") },
      { value: "hearing", label: t("listings.unit.accessibilityType.hearing") },
      { value: NONE_OPTION, label: t("t.n/a") },
    ])
  })

  it("treats non-numeric, empty and null AMI percentages as none", () => {
    const odd = [
      makeUnit({ id: "x1", amiPercentage: "abc" }),
      makeUnit({ id: "x2", amiPercentage: "" }),
      makeUnit({ id: "x3", amiPercentage: null as unknown as string }),
    ]
    const all = [unitA, ...odd]
    expect(buildUnitFilterOptions(all).amiPercentages).toEqual([
      { value: "30", label: "30%" },
      { value: NONE_OPTION, label: t("t.none") },
    ])
    expect(ids(applyUnitFilters(all, withFilters({ amiPercentages: [NONE_OPTION] })))).toEqual([
      "x1",
      "x2",
      "x3",
    ])
  })

  it("treats units without a unit type as none", () => {
    const noType = [
      makeUnit({ id: "n1", unitTypes: undefined }),
      makeUnit({ id: "n2", unitTypes: null as unknown as Unit["unitTypes"] }),
    ]
    expect(buildUnitFilterOptions([unitA, ...noType]).unitTypes).toEqual([
      { value: UnitTypeEnum.oneBdrm, label: t("listings.unitTypes.oneBdrm") },
      { value: NONE_OPTION, label: t("t.none") },
    ])
  })

  it("treats a chart with an empty id as none", () => {
    const emptyId = makeUnit({ id: "e", amiChart: { id: "" } as AmiChart })
    expect(buildUnitFilterOptions([unitA, emptyId]).amiCharts).toEqual([
      { value: "chart-bond", label: "2026 Bond" },
      { value: NONE_OPTION, label: t("t.none") },
    ])
  })

  it("returns empty option lists when there are no units", () => {
    expect(buildUnitFilterOptions([])).toEqual({
      unitTypes: [],
      amiCharts: [],
      amiPercentages: [],
      accessibilityTypes: [],
    })
  })
})

describe("applyUnitFilters", () => {
  it("returns every unit when no filter is set", () => {
    expect(ids(applyUnitFilters(units, emptyUnitFilters))).toEqual(["a", "b", "c"])
  })

  it("matches any checked value within a section", () => {
    const filters = withFilters({ unitTypes: [UnitTypeEnum.studio, UnitTypeEnum.oneBdrm] })
    expect(ids(applyUnitFilters(units, filters))).toEqual(["a", "b"])
  })

  it("matches units without a value through the none option", () => {
    expect(ids(applyUnitFilters(units, withFilters({ amiCharts: [NONE_OPTION] })))).toEqual(["c"])
    expect(
      ids(applyUnitFilters(units, withFilters({ accessibilityTypes: [NONE_OPTION] })))
    ).toEqual(["b"])
  })

  it("uses inclusive min and max bounds", () => {
    const filters = withFilters({ rent: { min: 900, max: 1200 } })
    expect(ids(applyUnitFilters(units, filters))).toEqual(["a", "b"])
  })

  it("supports a max-only range", () => {
    expect(ids(applyUnitFilters(units, withFilters({ rent: { max: 1000 } })))).toEqual(["b"])
  })
  it("supports a min-only range", () => {
    expect(ids(applyUnitFilters(units, withFilters({ rent: { min: 900 } })))).toEqual(["a", "b"])
  })
})

describe("isUnitFilterActive", () => {
  it("is false for empty filters", () => {
    expect(isUnitFilterActive(emptyUnitFilters)).toBe(false)
  })

  it("is true when a checkbox value is checked", () => {
    expect(isUnitFilterActive(withFilters({ unitTypes: [UnitTypeEnum.studio] }))).toBe(true)
  })

  it("is true when a range bound is zero", () => {
    expect(isUnitFilterActive(withFilters({ rent: { max: 0 } }))).toBe(true)
  })
})

describe("pruneUnitFilters", () => {
  it("drops checked values that are no longer options", () => {
    const options = buildUnitFilterOptions(units)
    const filters = withFilters({ unitTypes: [UnitTypeEnum.studio, UnitTypeEnum.threeBdrm] })
    expect(pruneUnitFilters(filters, options).unitTypes).toEqual([UnitTypeEnum.studio])
  })

  it("clears a section that has fewer than two options", () => {
    const options = buildUnitFilterOptions([unitA])
    const filters = withFilters({ unitTypes: [UnitTypeEnum.oneBdrm] })
    expect(pruneUnitFilters(filters, options).unitTypes).toEqual([])
  })

  it("returns the same object when nothing changes", () => {
    const options = buildUnitFilterOptions(units)
    const filters = withFilters({ unitTypes: [UnitTypeEnum.studio], rent: { min: 1 } })
    expect(pruneUnitFilters(filters, options)).toBe(filters)
  })
})
