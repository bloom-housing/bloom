import React, { useState } from "react"
import { FormOption } from "./ListingsSearchModal"

type MultiSelectGroupProps = {
  name: string
  inputs: FormOption[]
  values?: string[]
  onChange: (name: string, value: string[]) => void
}

/**
 * Creates a group of checkboxes and sets an array of selected values onChange()
 *
 * @param props
 * @returns
 */
export function MultiSelectGroup(props: MultiSelectGroupProps) {
  const startState = {}

  // Set state with initial values
  if (props.values) {
    props.values.forEach((value) => {
      startState[value] = true
    })
  }

  const [values, setValues] = useState(startState)

  const addRemoveValue = (value: string) => {
    // we need to create a new object otherwise state change won't trigger
    const stateCopy = {}
    Object.assign(stateCopy, values)

    // if the value is already there, mark as false
    if (stateCopy[value]) {
      stateCopy[value] = false
      //console.log(`Removing value [${value}]`) // uncomment to debug
    } else {
      // otherwise set as true
      stateCopy[value] = true
      //console.log(`Adding value [${value}]`) // uncomment to debug
    }

    setValues(stateCopy)

    const valuesArray = []

    // Loop through and find all values that are currently set
    Object.entries(stateCopy).forEach(([key, val]) => {
      if (val == true) {
        valuesArray.push(key)
      }
    })

    props.onChange(props.name, valuesArray)
  }

  return (
    <div key={props.name}>
      {props.inputs.map((input, index) => {
        return (
          <div key={`${props.name}-${input.value}`}>
            <input
              type="checkbox"
              checked={values[input.value] == true}
              name={props.name}
              value={input.value}
              tabIndex={index}
              key={index}
              onChange={() => {
                addRemoveValue(input.value)
              }}
            />
            <label>{input.label}</label>
          </div>
        )
      })}
    </div>
  )
}
