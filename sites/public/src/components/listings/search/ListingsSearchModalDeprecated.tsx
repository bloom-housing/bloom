import React, { useCallback, useEffect, useState } from "react"
import { ListingSearchParams, parseSearchString } from "../../../lib/listings/search"
import { t } from "@bloom-housing/ui-components"
import {
  ButtonGroup,
  ButtonGroupSpacing,
  Button,
  Field,
  FieldGroup,
  FieldSingle,
} from "@bloom-housing/doorway-ui-components"
import { Dialog } from "@bloom-housing/ui-seeds"
import { useForm } from "react-hook-form"
import { numericSearchFieldGenerator } from "./helpers"
import { FilterAvailabilityEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const inputSectionStyle: React.CSSProperties = {
  margin: "0px 15px",
}

const hyphenContainerStyle: React.CSSProperties = {
  position: "relative",
}

const hyphenStyle: React.CSSProperties = {
  fontSize: "2rem",
  position: "relative",
  bottom: "1px",
  padding: ".7rem",
  width: "100%",
}

const sectionTitle: React.CSSProperties = {
  fontWeight: "bold",
}

const sectionTitleTopBorder: React.CSSProperties = {
  fontWeight: "bold",
  borderTop: "2px solid var(--bloom-color-gray-450)",
  padding: "1rem 0 1rem 0",
}

const rentStyle: React.CSSProperties = {
  margin: "0px 0px",
  display: "flex",
}

const clearButtonStyle: React.CSSProperties = {
  textDecoration: "underline",
}

export type FormOption = {
  label: string
  value: string
  isDisabled?: boolean
  labelNoteHTML?: string
  doubleColumn?: boolean
}

type ListingsSearchModalProps = {
  open: boolean
  searchString?: string
  bedrooms: FormOption[]
  bathrooms: FormOption[]
  counties: FormOption[]
  onSubmit: (params: ListingSearchParams) => void
  onClose: () => void
  onFilterChange: (count: number) => void
}
// TODO: Refactor ListingsSearchModal to utilize react-hook-form. It is currently using a custom form object and custom valueSetters
// which is mostly functional but fails to leverage UI-C's formatting, accessibility and any other future improvements to the
// package. To expedite development and avoid excessive workarounds (ie. lines 213, 221), a full form refactor should be completed.
export function ListingsSearchModal(props: ListingsSearchModalProps) {
  const searchString = props.searchString || ""

  // We hold a map of county label to county FormOption
  const countyLabelMap = {}
  const countyLabels = []
  props.counties.forEach((county) => {
    countyLabelMap[county.label] = county
    countyLabels.push(county.label)
  })

  const nullState: ListingSearchParams = {
    bedrooms: null,
    bathrooms: null,
    minRent: "",
    monthlyRent: "",
    propertyName: "",
    counties: countyLabels,
    availability: null,
    ids: undefined,
  }
  const initialState = parseSearchString(searchString, nullState)
  const [formValues, setFormValues] = useState(initialState)

  const countFilters = useCallback((params: ListingSearchParams) => {
    let count = 0
    // For each of our search params, count the number that aren't empty
    Object.values(params).forEach((value) => {
      if (value == null || value == "") return
      if (Array.isArray(value) && value.length == props.counties.length) return
      count++
    })
    return count
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // We're factoring out the function to prevent requiring props in useEffect
  const filterChange = props.onFilterChange
  useEffect(() => {
    filterChange(countFilters(formValues))
  }, [formValues, filterChange, countFilters])

  // Run this once immediately after first render
  // Empty array is intentional; it's how we make sure it only runs once
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // Set initial filter count
    props.onFilterChange(countFilters(formValues))
    // Fetch listings
    onSubmit()
  }, [])

  const clearValues = () => {
    setFormValues(nullState)

    // Reset currency fields:

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.querySelector("#minRent").value = null
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.querySelector("#monthlyRent").value = null
  }

  const onSubmit = () => {
    props.onSubmit(formValues)
    props.onClose()
  }

  const updateValue = (name: string, value: string) => {
    // Create a copy of the current value to ensure re-render
    const newValues = {} as ListingSearchParams
    Object.assign(newValues, formValues)
    newValues[name] = value
    setFormValues(newValues)
    // console.log(`${name} has been set to ${value}`) // uncomment to debug
  }

  const updateValueMulti = (name: string, labels: string[]) => {
    const newValues = { ...formValues } as ListingSearchParams
    newValues[name] = labels
    setFormValues(newValues)
    // console.log(`${name} has been set to ${value}`) // uncomment to debug
  }

  const translatedBedroomOptions: FormOption[] = [
    {
      label: t("listings.unitTypes.any"),
      value: null,
    },
    {
      label: t("listings.unitTypes.studio"),
      value: "0",
    },
  ]

  const translatedBathroomOptions: FormOption[] = [
    {
      label: t("listings.unitTypes.any"),
      value: null,
    },
  ]

  const bedroomOptions: FormOption[] = [
    ...translatedBedroomOptions,
    ...numericSearchFieldGenerator(1, 4),
  ]
  const bathroomOptions: FormOption[] = [
    ...translatedBathroomOptions,
    ...numericSearchFieldGenerator(1, 4),
  ]
  const mkCountyFields = (counties: FormOption[]): FieldSingle[] => {
    const countyFields: FieldSingle[] = [] as FieldSingle[]

    const selected = {}

    formValues.counties.forEach((label) => {
      selected[label] = true
    })
    let check = false
    const dahliaNote = `(${t(
      "filter.goToDahlia"
    )} <a class="lined" href="https://housing.sfgov.org/" target="_blank">DAHLIA</a>)`
    counties.forEach((county, idx) => {
      // FieldGroup uses the label attribute to check for selected inputs.
      check = selected[county.label] !== undefined
      if (county.isDisabled) {
        check = false
      }
      countyFields.push({
        id: `county-item-${county.label}`,
        index: idx,
        label: county.label,
        value: county.value,
        defaultChecked: check,
        disabled: county.isDisabled || false,
        doubleColumn: county.doubleColumn || false,
        note: county.label === "San Francisco" ? dahliaNote : county.labelNoteHTML || "",
      } as FieldSingle)
    })
    return countyFields
  }
  const countyFields = mkCountyFields(props.counties)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, getValues, setValue, watch } = useForm()
  const monthlyRentFormatted = watch("monthlyRent")
  const minRentFormatted = watch("minRent")
  const currencyFormatting = /,|\.\d{2}/g

  // workarounds to leverage UI-C's currency formatting without full refactor
  useEffect(() => {
    if (typeof minRentFormatted !== "undefined") {
      const minRentRaw = minRentFormatted.replaceAll(currencyFormatting, "")
      updateValue("minRent", minRentRaw)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minRentFormatted])

  useEffect(() => {
    if (typeof monthlyRentFormatted !== "undefined") {
      const monthlyRentRaw = monthlyRentFormatted.replaceAll(currencyFormatting, "")
      updateValue("monthlyRent", monthlyRentRaw)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthlyRentFormatted])

  return (
    <Dialog
      className="listings-search-dialog"
      isOpen={props.open}
      onClose={props.onClose}
      ariaLabelledBy="search-filters-header"
    >
      <Dialog.Header id="search-filters-header">{t("search.filters")}</Dialog.Header>
      <Dialog.Content>
        <div style={inputSectionStyle}>
          <div style={sectionTitle}>{t("t.opportunityType")}</div>
          <ButtonGroup
            name="availability"
            options={[
              { label: t("listings.waitlist.open"), value: FilterAvailabilityEnum.waitlistOpen },
              { label: t("listings.availableUnits"), value: FilterAvailabilityEnum.unitsAvailable },
            ]}
            onChange={updateValue}
            value={formValues.availability}
            spacing={ButtonGroupSpacing.left}
          />
        </div>
        <div style={inputSectionStyle}>
          <div style={sectionTitle}>{t("t.bedrooms")}</div>
          <ButtonGroup
            name="bedrooms"
            options={bedroomOptions}
            onChange={updateValue}
            value={formValues.bedrooms}
            spacing={ButtonGroupSpacing.left}
          />
        </div>
        <div style={inputSectionStyle}>
          <div style={sectionTitle}>{t("t.bathrooms")}</div>
          <ButtonGroup
            name="bathrooms"
            options={bathroomOptions}
            onChange={updateValue}
            value={formValues.bathrooms}
            spacing={ButtonGroupSpacing.left}
          />
        </div>
        <div style={inputSectionStyle}>
          <div style={sectionTitleTopBorder}>{t("t.monthlyRent")}</div>
          <div style={rentStyle}>
            <Field
              type="currency"
              name="minRent"
              id="minRent"
              register={register}
              setValue={setValue}
              getValues={getValues}
              defaultValue={formValues.minRent}
              placeholder={t("t.minPrice")}
              className="doorway-field pb-6"
              inputClassName="rent-input"
              labelClassName="input-label"
            ></Field>
            <div style={hyphenContainerStyle}>
              <div style={hyphenStyle}>-</div>
            </div>
            <Field
              type="currency"
              name="monthlyRent"
              id="monthlyRent"
              register={register}
              setValue={setValue}
              getValues={getValues}
              defaultValue={formValues.monthlyRent}
              placeholder={t("t.maxPrice")}
              className="doorway-field pb-6"
              inputClassName="rent-input"
              labelClassName="input-label"
            ></Field>
          </div>
        </div>

        <div style={inputSectionStyle}>
          <div style={sectionTitleTopBorder}>{t("t.counties")}</div>
          <FieldGroup
            name="counties"
            fields={countyFields}
            onChange={updateValueMulti}
            register={register}
            fieldGroupClassName="doorway-field-group grid grid-cols-2"
            fieldLabelClassName="text-primary-dark font-medium tracking-wider text-2xs uppercase"
          />
        </div>
        <img src={"/images/county-map.png"} alt={t("welcome.bayAreaCountyMap")} />
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          type="button"
          className="is-secondary"
          onClick={onSubmit}
          id={"listings-map-filter-dialog-show-button"}
        >
          {t("t.showMatchingListings")}
        </Button>
        <div style={{ flexGrow: 1 }}></div>
        <button
          style={clearButtonStyle}
          onClick={clearValues}
          data-testid={"listings-map-filter-dialog-clear-button"}
        >
          {t("t.clearAllFilters")}
        </button>
      </Dialog.Footer>
    </Dialog>
  )
}
