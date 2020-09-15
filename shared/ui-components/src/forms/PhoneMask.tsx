import React from "react"
import MaskedInput from "react-input-mask"

export const PhoneMask = (props: any) => {
  const { value, onChange, name, disabled, placeholder } = props
  return (
    <MaskedInput
      id={name}
      name={name}
      value={value}
      type="text"
      className="input"
      placeholder={placeholder || "(555) 555-5555"}
      mask="(999) 999-9999"
      onChange={(e: any) => {
        e.persist()
        onChange(e.target.value)
      }}
      disabled={disabled}
    />
  )
}
