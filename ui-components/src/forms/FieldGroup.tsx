import React, { useState, useEffect, useCallback } from "react"
import { ExpandableContent } from "../actions/ExpandableContent"
import { ErrorMessage } from "../notifications/ErrorMessage"
import { UseFormMethods, RegisterOptions } from "react-hook-form"
import { Field } from "./Field"
import { t } from "../helpers/translator"

export interface FieldSingle {
  additionalText?: boolean
  dataTestId?: string
  defaultChecked?: boolean
  defaultText?: string
  description?: React.ReactNode
  disabled?: boolean
  id: string
  inputProps?: Record<string, unknown>
  label: string
  uniqueName?: boolean
  note?: string
  subFields?: FieldSingle[]
  type?: string
  value?: string
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
}: FieldGroupProps) => {
  // Always default align two-option radio groups side by side
  if (fields?.length === 2) {
    fieldGroupClassName = `${fieldGroupClassName} flex`
    fieldClassName = `${fieldClassName} flex-initial mr-4`
  }

  const [checkedInputs, setCheckedInputs] = useState<string[]>([])

  const subfieldsExist = () => {
    return fields?.filter((field) => field.subFields).length
  }

  const getIndividualInput = (item: FieldSingle): React.ReactNode => {
    return (
      <div key={item.value}>
        <input
          aria-describedby={`${name}-error`}
          aria-invalid={!!error || false}
          type={type}
          id={item.id}
          defaultValue={item.value || item.id}
          name={subfieldsExist() || item.uniqueName ? `${name}-${item.value}` : name}
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
          data-test-id={item.dataTestId ?? dataTestId}
        />
        <label
          htmlFor={item.id}
          className={`font-semibold ${fieldLabelClassName} ${
            item.disabled && "text-gray-600 cursor-not-allowed"
          }`}
        >
          {item.label}
        </label>
        {item.note && <span className={"field-note font-normal"}>{item.note}</span>}

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
            key={`${item.value}-additionalText`}
            name={`${name}-${item.value}`}
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
      {groupLabel && <label className="text__field-label">{groupLabel}</label>}
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
    </div>
  )
}

export { FieldGroup as default, FieldGroup }
