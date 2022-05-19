import React, { useState, useEffect, useCallback } from "react"
import { ExpandableContent } from "../actions/ExpandableContent"
import { ErrorMessage } from "../notifications/ErrorMessage"
import { UseFormMethods, RegisterOptions } from "react-hook-form"
import { Field } from "./Field"
import { t } from "../helpers/translator"

interface FieldSingle {
  id: string
  label: string
  value?: string
  dataTestId?: string
  defaultChecked?: boolean
  description?: React.ReactNode
  defaultText?: string
  disabled?: boolean
  note?: string
  inputProps?: Record<string, unknown>
  subFields?: FieldSingle[]
  type?: string
  additionalText?: boolean
}

interface FieldGroupProps {
  error?: boolean
  errorMessage?: string
  name: string
  type?: string
  groupLabel?: string
  fields?: FieldSingle[]
  groupNote?: string
  groupSubNote?: string
  register: UseFormMethods["register"]
  validation?: RegisterOptions
  fieldGroupClassName?: string
  fieldClassName?: string
  fieldLabelClassName?: string
  dataTestId?: string
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
}: FieldGroupProps) => {
  // Always align two-option radio groups side by side
  if (fields?.length === 2) {
    fieldGroupClassName = `${fieldGroupClassName} flex`
    fieldClassName = `${fieldClassName} flex-initial me-4`
  }

  const [checkedInputs, setCheckedInputs] = useState<string[]>([])

  const subfieldsExist = () => {
    return fields?.filter((field) => field.subFields).length
  }

  const getIndividualInput = (item: FieldSingle): React.ReactNode => {
    return (
      <div key={item.value}>
        <input
          aria-describedby={error ? `${name}-error` : name}
          aria-invalid={!!error || false}
          type={type}
          id={item.id}
          defaultValue={item.value || item.id}
          name={subfieldsExist() ? `${name}-${item.value}` : name}
          onClick={(e) => {
            // We cannot reliably target an individual checkbox in a field group since they have the same name, so we keep track on our own
            if (e.currentTarget.checked) {
              setCheckedInputs([...checkedInputs, item.label])
            } else {
              setCheckedInputs(checkedInputs.filter((subset) => item.label !== subset))
            }
          }}
          defaultChecked={item.defaultChecked || false}
          disabled={item.disabled}
          ref={register(validation)}
          {...item.inputProps}
          data-testid={item.dataTestId ?? dataTestId}
        />
        <label
          htmlFor={item.id}
          className={`font-semibold ${fieldLabelClassName} ${
            item.disabled && "text-gray-600 cursor-default cursor-not-allowed"
          }`}
        >
          {item.label}
        </label>
        {item.note && <span className={"field-note font-normal"}>{item.note}</span>}

        {item.description && (
          <div className="ml-8 -mt-1 mb-5">
            <ExpandableContent>
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
            key={`${item.value}-additionalText`}
            name={`${name}-${item.value}`}
            register={register}
            defaultValue={item.defaultText}
            placeholder={t("t.description")}
            className={"mb-4"}
            disabled={item.disabled}
            dataTestId={item.dataTestId}
          />
        )}
      </div>
    )
  }
  return (
    <>
      {groupLabel && <label className="field-label--caps">{groupLabel}</label>}
      {groupNote && <p className="field-note mb-4">{groupNote}</p>}

      <div className={`field ${error && "error"} ${fieldGroupClassName || ""} mb-0`}>
        {fields?.map((item) => (
          <div className={`field ${fieldClassName || ""} mb-1`} key={item.id}>
            {getInputSet(item)}
            {item.subFields && checkedInputs.indexOf(item.label) >= 0 && (
              <div className={"ml-8"} key={`${item.value}-subfields`}>
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
    </>
  )
}

export { FieldGroup as default, FieldGroup }
