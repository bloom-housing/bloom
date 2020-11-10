import React from "react"
import { t } from "../helpers/translator"
import { Field } from "./Field"
import { HouseholdMember } from "@bloom-housing/core"
import moment from "moment"
import { Controller } from "react-hook-form"
import { transformInputValue } from "@bloom-housing/ui-components"

export interface DOBFieldProps {
  error?: any
  label: string
  control?: any
  watch: any // comes from React Hook Form
  applicant: HouseholdMember
  atAge?: boolean
  name?: string
}

const DOBField = (props: DOBFieldProps) => {
  const { applicant, error, watch, atAge, name } = props
  const fieldName = (baseName: string) => {
    return [name, baseName].filter((item) => item).join(".")
  }
  const birthDay = watch(fieldName("birthDay"))
  const birthMonth = watch(fieldName("birthMonth"))
  const validateAge = (value: string) => {
    return (
      parseInt(value) > 1900 &&
      moment(`${birthMonth}/${birthDay}/${value}`, "MM/DD/YYYY") <
        moment().subtract(atAge ? 18 : 0, "years")
    )
  }

  return (
    <fieldset>
      <legend className="field-label--caps">{props.label}</legend>

      <div className="field-group--dob">
        <Controller
          name={fieldName("birthMonth")}
          defaultValue={applicant.birthMonth > 0 ? applicant.birthMonth : ""}
          control={props.control}
          rules={{
            required: true,
            validate: {
              monthRange: (value: string) => parseInt(value) > 0 && parseInt(value) <= 12,
            },
          }}
          render={(props) => (
            <Field
              type="number"
              register={null}
              name={props.name}
              label={t("t.month")}
              readerOnly={true}
              placeholder="MM"
              error={error?.birthMonth}
              inputProps={{
                value: transformInputValue.value(props.value),
                maxLength: 2,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  props.onChange(transformInputValue.onChange(e)),
              }}
            />
          )}
        />

        <Controller
          name={fieldName("birthDay")}
          defaultValue={applicant.birthDay > 0 ? applicant.birthDay : ""}
          control={props.control}
          rules={{
            required: true,
            validate: {
              dayRange: (value: string) => parseInt(value) > 0 && parseInt(value) <= 31,
            },
          }}
          render={(props) => (
            <Field
              register={null}
              name={props.name}
              label={t("t.day")}
              readerOnly={true}
              placeholder="DD"
              error={error?.birthDay}
              inputProps={{
                value: transformInputValue.value(props.value),
                maxLength: 2,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  props.onChange(transformInputValue.onChange(e)),
              }}
            />
          )}
        />

        <Controller
          name={fieldName("birthYear")}
          defaultValue={applicant.birthYear > 0 ? applicant.birthYear : ""}
          control={props.control}
          rules={{
            required: true,
            validate: {
              yearRange: (value: string) => validateAge(value),
            },
          }}
          render={(props) => (
            <Field
              register={null}
              name={props.name}
              label={t("t.year")}
              readerOnly={true}
              placeholder="YYYY"
              error={error?.birthYear}
              inputProps={{
                value: transformInputValue.value(props.value),
                maxLength: 4,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  props.onChange(transformInputValue.onChange(e)),
              }}
            />
          )}
        />
      </div>

      {(error?.birthMonth || error?.birthDay || error?.birthYear) && (
        <div className="field error">
          <span className="error-message">{t("application.name.dateOfBirthError")}</span>
        </div>
      )}
    </fieldset>
  )
}

export { DOBField as default, DOBField }
