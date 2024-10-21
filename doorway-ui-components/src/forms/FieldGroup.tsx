import React, { useState, useEffect, useCallback } from "react"
import { t, ExpandableContent, ErrorMessage } from "@bloom-housing/ui-components"
import { UseFormMethods, RegisterOptions } from "react-hook-form"
import { Field } from "./Field"
import "./FieldGroup.scss"

export interface FieldSingle {
  additionalText?: boolean
  dataTestId?: string
  defaultChecked?: boolean
  defaultText?: string
  description?: React.ReactNode
  disabled?: boolean
  doubleColumn?: boolean
  id: string
  inputProps?: Record<string, unknown>
  label: string
  uniqueName?: boolean
  note?: string // Using dangerouslySetInnerHTML
  subFields?: FieldSingle[]
  type?: string
  value?: string
  index?: number
}

interface FieldGroupProps {
  dataTestId?: string
  error?: boolean
  errorMessage?: string
  fieldClassName?: string
  fieldGroupClassName?: string
  fieldLabelClassName?: string
  fields?: FieldSingle[]
  groupLabel?: string
  groupNote?: string
  groupSubNote?: string
  name: string
  register: UseFormMethods["register"]
  type?: string
  validation?: RegisterOptions
  strings?: {
    description?: string
    readLess?: string
    readMore?: string
  }
  onChange?: (name: string, value: string[]) => void
}

const FieldGroup = ({
  name,
  groupLabel,
  fields,
  type = "checkbox",
  validation = {},
  error,
  errorMessage,
  groupNote,
  register,
  fieldGroupClassName,
  fieldClassName,
  fieldLabelClassName,
  groupSubNote,
  dataTestId,
  strings,
  onChange,
}: FieldGroupProps) => {
  // Always default align two-option radio groups side by side
  if (fields?.length === 2) {
    fieldGroupClassName = `${fieldGroupClassName || ""} flex`
    fieldClassName = `${fieldClassName || ""} flex-initial mr-4`
  }
  const initiallyChecked: string[] = []
  fields?.forEach((f) => {
    if (f.defaultChecked) {
      initiallyChecked.push(f.label)
    }
  })

  const [checkedInputs, setCheckedInputs] = useState<string[]>(initiallyChecked)

  const subfieldsExist = () => {
    return fields?.filter((field) => field.subFields).length
  }

  const getIndividualInput = (item: FieldSingle): React.ReactNode => {
    const [checked, setChecked] = useState<boolean>(checkedInputs.indexOf(item.label) > -1)
    return (
      <div key={item.value}>
        <input
          aria-describedby={`${name}-error`}
          aria-invalid={!!error || false}
          type={type}
          id={item.id}
          defaultValue={item.value || item.id}
          name={subfieldsExist() || item.uniqueName ? `${name}-${item.value || ""}` : name}
          onClick={(e) => {
            if (item.disabled) {
              return
            }
            // We cannot reliably target an individual checkbox in a field group,
            // since they have the same name, so we keep track on our own.
            let currentLabels = []
            if (e.currentTarget.checked) {
              currentLabels = [...checkedInputs, item.label]
            } else {
              currentLabels = checkedInputs.filter((subset) => item.label !== subset)
            }
            setCheckedInputs(currentLabels)

            if (onChange) {
              // Update values in parent component
              onChange(name, currentLabels)
            }
          }}
          checked={checkedInputs.indexOf(item.label) > -1}
          // Setting `onChange` is to avoid a warning for using a mutable checked attribute, rather
          // than using defaultChecked.
          onChange={(e) => {
            if (!checkedInputs) {
              setChecked(e.currentTarget.checked)
            }
          }}
          disabled={item.disabled}
          ref={register(validation)}
          {...item.inputProps}
          data-testid={item.dataTestId ?? dataTestId}
        />
        <label
          htmlFor={item.id}
          className={`${fieldLabelClassName || ""} ${item.disabled ? "cursor-not-allowed" : ""}`}
        >
          {item.label}
        </label>
        {item.note && (
          <span
            className={"field-note font-normal"}
            dangerouslySetInnerHTML={{ __html: item.note }}
          ></span>
        )}
        {item.description && (
          <div className="ml-8 -mt-1 mb-5">
            <ExpandableContent
              strings={{
                readMore: strings?.readMore ?? t("t.readMore"),
                readLess: strings?.readLess ?? t("t.readLess"),
              }}
            >
              <p className="field-note mb-2 -mt-2">{item.description}</p>
            </ExpandableContent>
          </div>
        )}
      </div>
    )
  }

  const checkSelected = useCallback(
    (formFields: FieldSingle[] | undefined, checkedValues: string[]) => {
      formFields?.forEach((field) => {
        if (field.defaultChecked) {
          checkedValues.push(field.label)
        }
        if (field.subFields) {
          checkSelected(field.subFields, checkedValues)
        }
      })
    },
    []
  )

  useEffect(() => {
    const initialValues: string[] = []
    checkSelected(fields, initialValues)
    setCheckedInputs([...initialValues])
  }, [checkSelected, setCheckedInputs, fields])

  const getInputSet = (item: FieldSingle): React.ReactNode => {
    return (
      <div key={item.value}>
        {getIndividualInput(item)}
        {item.additionalText && checkedInputs.indexOf(item.label) >= 0 && (
          <Field
            id={item.id}
            key={`${item.value || ""}-additionalText`}
            name={`${name}-${item.value || ""}`}
            register={register}
            defaultValue={item.defaultText}
            placeholder={strings?.description ?? t("t.description")}
            className={"mb-4"}
            disabled={item.disabled}
            dataTestId={item.dataTestId}
          />
        )}
      </div>
    )
  }

  return (
    <div>
      {groupLabel && <label className="text__caps-spaced">{groupLabel}</label>}
      {groupNote && <p className="field-note mb-4">{groupNote}</p>}

      <div className={`field ${error ? "error" : ""} ${fieldGroupClassName || ""} mb-0`}>
        {fields?.map((item) => (
          <div
            className={`field ${fieldClassName || ""} ${
              item.doubleColumn ? "col-span-2" : ""
            } mb-1`}
            key={item.id}
          >
            {getInputSet(item)}
            {item.subFields && checkedInputs.indexOf(item.label) >= 0 && (
              <div className={"ml-8"} key={`${item.value || ""}-subfields`}>
                {item.subFields?.map((subItem) => {
                  return getInputSet(subItem)
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      {groupSubNote && <p className="field-sub-note">{groupSubNote}</p>}
      {error && errorMessage && (
        <ErrorMessage id={`${name}-error`} error={error}>
          {errorMessage}
        </ErrorMessage>
      )}
    </div>
  )
}

export { FieldGroup as default, FieldGroup }
