import React, { useRef, useEffect, useMemo } from "react"
import { UseFormMethods, RegisterOptions } from "react-hook-form"
import { Icon } from "@bloom-housing/ui-components"
import "./MultiSelectField.scss"

export interface MultiSelectFieldItem {
  value: string
  label: string
}

export type MultiSelectDataSourceParams<T> = (
  query: string,
  render: (toRender: MultiSelectFieldItem[]) => void,
  isFirstCall: boolean
) => T

export interface MultiSelectFieldProps {
  name: string
  dataSource:
    | string
    | string[]
    | MultiSelectFieldItem[]
    | MultiSelectDataSourceParams<MultiSelectFieldItem[]>
    | MultiSelectDataSourceParams<Promise<MultiSelectFieldItem[]>>
  register: UseFormMethods["register"]
  getValues: UseFormMethods["getValues"]
  setValue: UseFormMethods["setValue"]
  placeholder?: string
  validation?: RegisterOptions
  label?: string
  id?: string
  dataTestId?: string
}

const MultiSelectField = (props: MultiSelectFieldProps) => {
  const autocompleteRef = useRef<HTMLInputElement>(null)

  const { name, register, setValue } = props
  register({ name }, props.validation)

  useEffect(() => {
    // We need to dynamically import the aria-autocomplete control only on the
    // client-side, because of its use of `window` and other browser-only
    // capabilities (and it doesn't really make sense to SSR the control anyway)

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      if (autocompleteRef.current) {
        const AriaAutocomplete = (await import("aria-autocomplete")).default
        autocompleteRef.current.value = props.getValues(name)
        AriaAutocomplete(autocompleteRef.current, {
          source: props.dataSource,
          delay: 300, // debounce for 300ms
          inputClassName: "input",
          multiple: true,
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
    })()
  }, [autocompleteRef, name, setValue, props])

  const label = useMemo(() => {
    const labelClasses = ["label"]

    return (
      <label className={labelClasses.join(" ")} htmlFor={props.id}>
        {props.label}
      </label>
    )
  }, [props.id, props.label])

  return (
    <div className="field multi-select-field">
      {props.label && label}
      <div className="control" data-testid={props.dataTestId}>
        <Icon symbol="search" size="medium" />
        <input
          id={props.id}
          ref={autocompleteRef}
          className="input"
          placeholder={props.placeholder}
        />
      </div>
    </div>
  )
}

export { MultiSelectField as default, MultiSelectField }
