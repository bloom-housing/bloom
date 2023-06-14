import React, { useEffect, useState } from "react"
import { ListingSearchParams, parseSearchString } from "../../../lib/listings/search"
import { Modal, ButtonGroup, FieldGroup, FieldSingle } from "@bloom-housing/doorway-ui-components"
import { useForm } from "react-hook-form"

const inputSectionStyle: React.CSSProperties = {
  margin: "0px 15px",
  borderTop: "1px solid black",
}

const textInputStyle: React.CSSProperties = {
  border: "1px solid black",
  padding: "2px 4px",
  margin: "5px",
}

const clearButtonStyle: React.CSSProperties = {
  textDecoration: "underline",
}

export type FormOption = {
  label: string
  value: string
  isDisabled?: boolean
  labelNoteHTML?: string
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
    counties: countyLabels,
  }
  const initialState = parseSearchString(searchString, nullState)
  const [formValues, setFormValues] = useState(initialState)

  const countFilters = (params: ListingSearchParams) => {
    let count = 0
    // For each of our search params, count the number that aren't empty
    Object.values(params).forEach((value) => {
      if (value == null || value == "") return
      if (Array.isArray(value) && value.length == props.counties.length) return
      count++
    })
    return count
  }

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
    // TODO: fix this
    // This code gets called but the UI doesn't update in response to state change
    setFormValues(nullState)
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

  const mkCountyFields = (counties: FormOption[]): FieldSingle[] => {
    const countyFields: FieldSingle[] = [] as FieldSingle[]

    const selected = {}

    formValues.counties.forEach((label) => {
      selected[label] = true
    })
    let check = false
    counties.forEach((county, idx) => {
      // FieldGroup uses the label attribute to check for selected inputs.
      check = selected[county.label] !== undefined
      if (county.isDisabled) {
        check = false
      }
      countyFields.push({
        id: `county-item-${idx}`,
        index: idx,
        label: county.label,
        value: county.value,
        defaultChecked: check,
        disabled: county.isDisabled || false,
        note: county.labelNoteHTML || "",
      } as FieldSingle)
    })
    return countyFields
  }
  const countyFields = mkCountyFields(props.counties)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = useForm()
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      title={"Filters"}
      ariaDescription="Listing Search Filters"
      actions={[
        <button onClick={onSubmit}>Show matching listings</button>,
        <div style={{ flexGrow: 1 }}></div>,
        <button style={clearButtonStyle} onClick={clearValues}>
          Clear all filters
        </button>,
      ]}
    >
      <div style={inputSectionStyle}>
        <div>Bedrooms</div>
        <ButtonGroup
          name="bedrooms"
          options={props.bedrooms}
          onChange={updateValue}
          value={formValues.bedrooms}
        />
      </div>

      <div style={inputSectionStyle}>
        <div>Bathrooms</div>
        <ButtonGroup
          name="bathrooms"
          options={props.bathrooms}
          onChange={updateValue}
          value={formValues.bathrooms}
        />
      </div>
      <div style={inputSectionStyle}>
        <div>Monthly Rent</div>
        <input
          type="text"
          name="minRent"
          value={formValues.minRent}
          placeholder="Min Price: $"
          style={textInputStyle}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            updateValue("minRent", e.currentTarget.value)
          }}
        />
        <input
          type="text"
          name="monthlyRent"
          value={formValues.monthlyRent}
          placeholder="Max Price: $"
          style={textInputStyle}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            updateValue("monthlyRent", e.currentTarget.value)
          }}
        />
      </div>

      <div style={inputSectionStyle}>
        <div>Locations</div>
        <FieldGroup
          name="counties"
          fields={countyFields}
          onChange={updateValueMulti}
          register={register}
        />
      </div>
    </Modal>
  )
}
