import React, { useState } from "react"
import { Field, t } from "@bloom-housing/ui-components"
import { Button, Drawer, Grid } from "@bloom-housing/ui-seeds"
import { FilterCollapsibleSection } from "./FilterCollapsibleSection"
import {
  CheckboxFilterKey,
  emptyUnitFilters,
  MIN_OPTIONS_TO_SHOW,
  NumberRange,
  parseNumber,
  RangeFilterKey,
  UnitFilterOptions,
  UnitFilters,
} from "./unitFilterHelpers"
import styles from "./UnitFilterDrawer.module.scss"

const noneTouched: Record<RangeFilterKey, boolean> = { rent: false, sqFeet: false }
const allTouched: Record<RangeFilterKey, boolean> = { rent: true, sqFeet: true }

type RangeDraft = { min: string; max: string }
type FilterDraft = Record<CheckboxFilterKey, string[]> & Record<RangeFilterKey, RangeDraft>

type RangeSectionConfig = {
  key: RangeFilterKey
  title: string
  minError: string
  maxError: string
  prepend?: string
}

const toRangeDraft = (range: NumberRange): RangeDraft => ({
  min: range.min?.toString() ?? "",
  max: range.max?.toString() ?? "",
})

const toRange = (draft: RangeDraft): NumberRange => ({
  min: parseNumber(draft.min),
  max: parseNumber(draft.max),
})

const toDraft = (filters: UnitFilters): FilterDraft => ({
  ...filters,
  rent: toRangeDraft(filters.rent),
  sqFeet: toRangeDraft(filters.sqFeet),
})

const fromDraft = (draft: FilterDraft): UnitFilters => ({
  ...draft,
  rent: toRange(draft.rent),
  sqFeet: toRange(draft.sqFeet),
})

const isRangeInvalid = (range: NumberRange) =>
  range.min !== undefined && range.max !== undefined && range.min > range.max

interface UnitFilterDrawerProps {
  filters: UnitFilters
  onApply: (filters: UnitFilters) => void
  onClose: () => void
  options: UnitFilterOptions
}

export const UnitFilterDrawer = ({ filters, onApply, onClose, options }: UnitFilterDrawerProps) => {
  const [draft, setDraft] = useState<FilterDraft>(() => toDraft(filters))
  const [touched, setTouched] = useState<Record<RangeFilterKey, boolean>>(noneTouched)

  const nextFilters = fromDraft(draft)
  const invalidRanges: Record<RangeFilterKey, boolean> = {
    rent: isRangeInvalid(nextFilters.rent),
    sqFeet: isRangeInvalid(nextFilters.sqFeet),
  }

  const toggleOption = (key: CheckboxFilterKey, value: string) =>
    setDraft((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }))

  const setRangeValue = (key: RangeFilterKey, bound: keyof RangeDraft, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [bound]: value } }))
    setTouched((prev) => ({ ...prev, [key]: false }))
  }

  const onSubmit = () => {
    if (invalidRanges.rent || invalidRanges.sqFeet) {
      setTouched(allTouched)
      return
    }
    onApply(nextFilters)
  }

  const onClear = () => {
    setDraft(toDraft(emptyUnitFilters))
    setTouched(noneTouched)
  }

  const checkboxSection = (key: CheckboxFilterKey, title: string) => {
    if (options[key].length < MIN_OPTIONS_TO_SHOW) return null

    return (
      <FilterCollapsibleSection title={title}>
        <fieldset>
          <legend className="sr-only">{title}</legend>
          <Grid spacing="sm">
            <Grid.Row columns={2}>
              {options[key].map((option, index) => (
                <Grid.Cell key={option.value}>
                  <Field
                    id={`unit-filter-${key}-${index}`}
                    name={`unit-filter-${key}-${index}`}
                    label={option.label}
                    labelClassName={styles["checkbox-label"]}
                    type="checkbox"
                    inputProps={{
                      checked: draft[key].includes(option.value),
                      onChange: () => toggleOption(key, option.value),
                    }}
                  />
                </Grid.Cell>
              ))}
            </Grid.Row>
          </Grid>
        </fieldset>
      </FilterCollapsibleSection>
    )
  }

  const rangeSection = ({ key, title, minError, maxError, prepend }: RangeSectionConfig) => {
    const showError = touched[key] && invalidRanges[key]

    return (
      <FilterCollapsibleSection title={title}>
        <fieldset>
          <legend className="sr-only">{title}</legend>
          <Grid spacing="sm">
            <Grid.Row columns={2}>
              {(["min", "max"] as const).map((bound) => (
                <Grid.Cell key={bound}>
                  <Field
                    id={`unit-filter-${key}-${bound}`}
                    name={`unit-filter-${key}-${bound}`}
                    label={t(bound === "min" ? "t.minimum" : "t.maximum")}
                    type="number"
                    ariaLabel={`${t(bound === "min" ? "t.minimum" : "t.maximum")} ${title}`}
                    prepend={prepend}
                    error={showError}
                    errorMessage={showError ? t(bound === "min" ? minError : maxError) : undefined}
                    inputProps={{
                      value: draft[key][bound],
                      min: 0,
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                        setRangeValue(key, bound, e.target.value),
                      onBlur: () => setTouched((prev) => ({ ...prev, [key]: true })),
                    }}
                  />
                </Grid.Cell>
              ))}
            </Grid.Row>
          </Grid>
        </fieldset>
      </FilterCollapsibleSection>
    )
  }

  return (
    <Drawer
      isOpen
      onClose={onClose}
      ariaLabelledBy="unit-filter-drawer-header"
      className={styles["filter-drawer"]}
    >
      <Drawer.Header id="unit-filter-drawer-header">{t("t.filter")}</Drawer.Header>
      <Drawer.Content>
        {checkboxSection("unitTypes", t("listings.unit.type"))}
        {checkboxSection("amiCharts", t("listings.unit.amiChart"))}
        {checkboxSection("amiPercentages", t("t.ami"))}
        {rangeSection({
          key: "rent",
          title: t("listings.unit.rent"),
          minError: "errors.minGreaterThanMaxRentError",
          maxError: "errors.maxLessThanMinRentError",
          prepend: "$",
        })}
        {rangeSection({
          key: "sqFeet",
          title: t("listings.unit.sqft"),
          minError: "errors.minGreaterThanMaxFootageError",
          maxError: "errors.maxLessThanMinFootageError",
        })}
        {checkboxSection("accessibilityTypes", t("listings.unit.accessibilityPriorityType"))}
      </Drawer.Content>
      <Drawer.Footer>
        <Button type="button" variant="primary" size="sm" onClick={onSubmit}>
          {t("t.filter")}
        </Button>
        <Button type="button" variant="primary-outlined" size="sm" onClick={onClear}>
          {t("listingFilters.clear")}
        </Button>
      </Drawer.Footer>
    </Drawer>
  )
}
