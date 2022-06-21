import React, { useRef, useEffect, useMemo } from "react"
import AriaAutocomplete from "aria-autocomplete"
import { UseFormMethods, RegisterOptions } from "react-hook-form"
import "./MultiSelectField.scss"

interface MultiSelectFieldProps {
  name: string
  placeholder?: string
  dataSource: any
  register: UseFormMethods["register"]
  validation?: RegisterOptions
  setValue: UseFormMethods["setValue"]
  label?: string
  id?: string
  dataTestId?: string
}

const MultiSelectField = (props: MultiSelectFieldProps) => {
  const autocompleteRef = useRef<HTMLInputElement>(null)

  const { name, register, setValue } = props
  register({ name }, props.validation)

  useEffect(() => {
    if (autocompleteRef.current) {
      AriaAutocomplete(autocompleteRef.current, {
        source: props.dataSource,
        delay: 500, // debounce for a half-second
        inputClassName: "input",
        multiple: true,
        placeholder: "Type to refine",
        deleteOnBackspace: true,
        showAllControl: true,
        cssNameSpace: "multi-select-field",
        onChange: (selected) => {
          setValue(
            name,
            selected.map((item) => item.value)
          )
        },
      })
    }
  }, [autocompleteRef, name, setValue, props.dataSource])

  const label = useMemo(() => {
    const labelClasses = ["label"]

    return (
      <label className={labelClasses.join(" ")} htmlFor={props.id || props.name}>
        {props.label}
      </label>
    )
  }, [props.id, props.name, props.label])

  return (
    <div className="field multi-select-field">
      {props.label && label}
      <div className="control">
        <input ref={autocompleteRef} />
      </div>
    </div>
  )
}

export { MultiSelectField as default, MultiSelectField }
