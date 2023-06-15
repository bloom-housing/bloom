import React, { useState } from "react"
import "./ButtonGroup.scss"
import Button from "./Button"

export enum ButtonGroupSpacing {
  between = "between",
  even = "even",
}
export type FormOption = {
  label: string
  value: string
  isDisabled?: boolean
}

export interface ButtonGroupProps {
  /** Pass either Button components in, or fragments which can contain one or more buttons */
  columns?: React.ReactNodeArray

  /** Between spacing pushes the columns far apart, even spacing keeps them closer together */
  spacing?: ButtonGroupSpacing
  /** When true, buttons will collapse to a single column on small screens and go full-width */
  fullwidthMobile?: boolean
  /** When true, the flex ordering of columns will reverse (aka RTL) */
  reversed?: boolean
  /** When true, pagination styling will be applied */
  pagination?: boolean

  name?: string
  options?: FormOption[]
  value?: string
  showBorder?: boolean
  onChange?: (name: string, value: string | null) => void
}



const ButtonGroup = (props: ButtonGroupProps) => {
  let spacing = ButtonGroupSpacing.between
  if (props.spacing) {
    spacing = props.spacing
  }
  const nullState: {index: null | number, value: null | string} = {
    index: null,
    value: null,
  }
  let options: FormOption[] = []
  if (props.options) {
    options = props.options
  }

  let initialState = nullState
  if (props.value) {
    options.forEach((button, index) => {
      if (button.value == props.value) {
        initialState = {
          index: index,
          value: button.value,
        }
      }
    })
  }

  const [selection, setSelection] = useState(initialState)
  let name: string = ""
  if (props.name) {
    name = props.name
  }

  const setActiveButton = (index: number) => {
    const value = options[index].value
    setSelection({
      index: index,
      value: value,
    })
    if (props.onChange) {
      props.onChange(name, value)
    }
  }

  const deselectHandler = (index: number) => {
    if (selection.index == index) {
      setSelection(nullState)
      if (props.onChange) {
        props.onChange(name, null)
      }
    }
  }

  const spacingClassName = `has-${spacing}-spacing`
  const classNames = ["button-group", spacingClassName]
  if (props.fullwidthMobile) classNames.push("has-fullwidth-mobile-buttons")
  if (props.reversed) classNames.push("is-reversed")
  if (props.pagination) classNames.push("pagination")

  if (props.columns) {
     return (
    <div className={classNames.join(" ")}>
      {props.columns.map((column, index) => (
        <div key={index} className="button-group__column">
          {column}
        </div>
      ))}
    </div>
     )
  }
  return (
    <div className={classNames.join(" ")}>
      {options.map((option, index) => (
        <div key={index} className="button-group__column">
          <Button
            isActive={selection.index == index}
            label={option.label}
            value={option.value}
            index={index}
            key={index}
            onSelect={setActiveButton}
            onDeselect={deselectHandler}
            children={option.label}
          />
        </div>
      ))}
    </div>
  )
}

export { ButtonGroup as default, ButtonGroup }
