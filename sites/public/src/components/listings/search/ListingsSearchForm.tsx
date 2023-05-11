import React, { useEffect, useState } from "react"
import { ButtonBar } from "./ButtonBar"
import { MultiSelectGroup } from "./MultiSelectGroup"
import { ListingSearchParams, parseSearchString } from "../../../lib/listings/search"

type ListingsSearchFormProps = {
  searchString?: string
  bedrooms: FormOption[]
  bathrooms: FormOption[]
  counties: FormOption[]
  onSubmit: (params: ListingSearchParams) => void
}

export type FormOption = {
  label: string
  value: string
  isDisabled?: boolean
}

const containerStyle: React.CSSProperties = {
  width: "600px",
  margin: "15px auto",
  border: "1px solid black",
}

const headerStyle: React.CSSProperties = {
  padding: "3px 15px",
  borderBottom: "1px solid black",
}

const inputSectionStyle: React.CSSProperties = {
  margin: "0px 15px",
  borderTop: "1px solid black",
}

const footerStyle: React.CSSProperties = {
  display: "flex",
  padding: "3px 15px",
  borderTop: "1px solid black",
}

const clearButtonStyle: React.CSSProperties = {
  textDecoration: "underline",
}

export function ListingsSearchForm(props: ListingsSearchFormProps) {
  const searchString = props.searchString || ""

  console.log(`Search string: ${searchString}`)
  const initialState = parseSearchString(
    {
      bedrooms: null,
      bathrooms: null,
      // Using an empty array here is how we know to look for an array value
      counties: [],
    },
    searchString
  )

  const [formValues, setFormValues] = useState(initialState)

  const clearValues = () => {
    setFormValues({
      bedrooms: null,
      bathrooms: null,
      counties: [],
    })
    console.log(`Clearing all values`)
  }

  const onSubmit = () => {
    props.onSubmit(formValues)
  }

  const updateValue = (name: string, value: string) => {
    // Create a copy of the current value to ensure re-render
    const newValues = {} as ListingSearchParams
    Object.assign(newValues, formValues)
    newValues[name] = value
    setFormValues(newValues)
    //console.log(`${name} has been set to ${value}`)
  }

  const updateValueMulti = (name: string, value: string[]) => {
    formValues[name] = value
    setFormValues(formValues)
    //console.log(`${name} has been set to ${value}`)
  }

  // load listings after render
  useEffect(() => {
    onSubmit()
  }, [])

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span style={{ marginLeft: "15px" }}>Filters</span>
      </div>

      <div style={inputSectionStyle}>
        <div>Bedrooms</div>
        <ButtonBar
          name="bedrooms"
          options={props.bedrooms}
          onChange={updateValue}
          value={formValues.bedrooms}
        />
      </div>

      <div style={inputSectionStyle}>
        <div>Bathrooms</div>
        <ButtonBar
          name="bathrooms"
          options={props.bathrooms}
          onChange={updateValue}
          value={formValues.bathrooms}
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

      <div style={footerStyle}>
        <button style={clearButtonStyle} onClick={clearValues}>
          Clear all filters
        </button>
        <div style={{ flexGrow: 1 }}></div>
        <button onClick={onSubmit}>Show matching listings</button>
      </div>
    </div>
  )
}
