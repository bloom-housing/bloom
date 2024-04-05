import { Button, FormOption } from "@bloom-housing/doorway-ui-components"
import React from "react"

interface ButtonCheckboxProps {
  name?: string
  value: string[]
  options: FormOption[]
  onChange: (name: string, values: string[]) => void
  spacing?: ButtonGroupSpacing
  fullwidthMobile?: boolean
  reversed?: boolean
  pagination?: boolean
  showBorder?: boolean
  className?: string
}

export enum ButtonGroupSpacing {
  between = "between",
  even = "even",
  left = "justify-left",
}

const ButtonCheckboxGroup = ({ name, options, value, onChange, ...props }: ButtonCheckboxProps) => {
  const handleButtonClick = (optionValue: string) => {
    if (value.includes(optionValue)) {
      // If the option is already selected, unselect it
      return value.filter((prevOption) => prevOption !== optionValue)
    } else {
      // If the option is not selected, select it
      return [...value, optionValue]
    }
  }

  let spacing = ButtonGroupSpacing.between
  if (props.spacing) {
    spacing = props.spacing
  }

  const spacingClassName = `has-${spacing}-spacing`
  const classNames = ["button-group", spacingClassName]
  if (props.fullwidthMobile) classNames.push("has-fullwidth-mobile-buttons")
  if (props.reversed) classNames.push("is-reversed")
  if (props.pagination) classNames.push("pagination")
  if (props.className) classNames.push(props.className)

  return (
    <div className={classNames.join(" ")}>
      {options.map((option) => (
        <Button
          className="button-group__column"
          isActive={value.includes(option.value)}
          key={`${name}-${option.value}`}
          onClick={() => onChange(name, handleButtonClick(option.value))}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}

export default ButtonCheckboxGroup
