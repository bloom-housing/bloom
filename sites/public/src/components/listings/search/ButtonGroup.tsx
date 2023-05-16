import React, { useState } from "react"
import { Button } from "./Button"
import { FormOption } from "./ListingsSearchForm"

type ButtonGroupProps = {
  name: string
  options: FormOption[]
  value?: string
  showBorder?: boolean
  onChange: (name: string, value: string) => void
}

export function ButtonGroup(props: ButtonGroupProps) {
  const nullState = {
    index: null,
    value: null,
  }

  let initialState = nullState

  if (props.value) {
    props.options.forEach((button, index) => {
      if (button.value == props.value) {
        initialState = {
          index: index,
          value: button.value,
        }
      }
    })
  }

  const [selection, setSelection] = useState(initialState)

  const setActiveButton = (index: number) => {
    const value = props.options[index].value

    setSelection({
      index: index,
      value: value,
    })

    props.onChange(props.name, value)
  }

  const deselectHandler = (index: number) => {
    if (selection.index == index) {
      setSelection(nullState)
    }
  }

  return (
    <div>
      {props.options.map((button, index) => {
        return (
          <Button
            isActive={selection.index == index}
            label={button.label}
            value={button.value}
            index={index}
            key={index}
            onSelect={setActiveButton}
            onDeselect={deselectHandler}
          />
        )
      })}
    </div>
  )
}
