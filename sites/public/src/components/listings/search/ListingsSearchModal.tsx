import React, { useEffect, useState } from "react"
import { ButtonGroup } from "./ButtonGroup"
import { MultiSelectGroup } from "./MultiSelectGroup"
import { ListingSearchParams, parseSearchString } from "../../../lib/listings/search"
import { Modal } from "@bloom-housing/ui-components"

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

export type FormOption = {
  label: string
  value: string
  isDisabled?: boolean
}

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

/**
 * A form for searching listings
 *
 * @param props
 * @returns
 */
export function ListingsSearchModal(props: ListingsSearchModalProps) {
  const searchString = props.searchString || ""

  const nullState: ListingSearchParams = {
    bedrooms: null,
    bathrooms: null,
    monthlyRent: "",
    // Using an empty array here is how we know to look for an array value when parsing
    counties: [],
  }

  const initialState = parseSearchString(searchString, nullState)
  const [formValues, setFormValues] = useState(initialState)

  const clearValues = () => {
    // TODO: fix this
    // This code gets called but the UI doesn't update in response to state change
    setFormValues(nullState)
    props.onFilterChange(0) // should be no active filters
    console.log(`Clearing all values`)
  }

  const onSubmit = () => {
    props.onSubmit(formValues)
  }

  const countFilters = (params: ListingSearchParams) => {
    let count = 0

    // For each of our search params, count the number that aren't empty
    Object.values(params).forEach((value) => {
      if (value == null || value == "") return

      if (Array.isArray(value) && value.length < 1) return

      count++
    })

    return count
  }

  const updateValue = (name: string, value: string) => {
    // Create a copy of the current value to ensure re-render
    const newValues = {} as ListingSearchParams
    Object.assign(newValues, formValues)
    newValues[name] = value
    setFormValues(newValues)
    props.onFilterChange(countFilters(newValues))
    //console.log(`${name} has been set to ${value}`) // uncomment to debug
  }

  const updateValueMulti = (name: string, value: string[]) => {
    formValues[name] = value
    setFormValues(formValues)
    props.onFilterChange(countFilters(formValues))
    //console.log(`${name} has been set to ${value}`) // uncomment to debug
  }

  // run this once immediately after first render
  useEffect(() => {
    // set initial filter count
    props.onFilterChange(countFilters(initialState))

    // fetch listings
    onSubmit()
  }, [])

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
        <MultiSelectGroup
          name="counties"
          inputs={props.counties}
          onChange={updateValueMulti}
          values={formValues.counties}
        />
      </div>
    </Modal>
  )
}
