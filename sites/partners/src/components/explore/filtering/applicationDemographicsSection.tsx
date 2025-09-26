/* eslint-disable @typescript-eslint/unbound-method */
import React from "react"
import { UseFormMethods } from "react-hook-form"
import { Field as TextInputField, MultiSelectField } from "@bloom-housing/ui-components"
import { dropdownOptions } from "./options"
import { FormValues } from "./mainForm"
import { HeadingGroup } from "@bloom-housing/ui-seeds"

interface Props {
  form: UseFormMethods<FormValues>
}

export function ApplicationDemographicsSection({ form }: Props) {
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = form

  return (
    <section className="flex flex-col border-b py-8">
      {/* Section and title will need to be extracted into its own layout component */}
      <HeadingGroup
        heading="Primary application demographics"
        subheading="Set the specific primary applicant demographics to be included"
      />
      <div className="flex flex-row gap-4 pb-6">
        <MultiSelectField
          label="Race"
          name="races"
          dataSource={dropdownOptions.races}
          register={register}
          getValues={getValues}
          setValue={setValue}
          placeholder="Select one or more race"
          validation={{
            validate: (value: string[]) => {
              if (!value || value.length === 0) {
                return "Please select at least one race option"
              }
              return true
            },
          }}
        />
        {Array.isArray(errors.races) &&
          errors.races.map((error, idx) =>
            error?.message ? (
              <p className="error" key={idx}>
                {error.message}
              </p>
            ) : null
          )}

        <MultiSelectField
          label="Ethnicity"
          name="ethnicities"
          dataSource={dropdownOptions.ethnicities}
          register={register}
          getValues={getValues}
          setValue={setValue}
          placeholder="Select ethnicity"
          validation={{
            validate: (value: string[]) => {
              if (!value || value.length === 0) {
                return "Please select at least one ethnicity option"
              }
              return true
            },
          }}
        />
        {Array.isArray(errors.ethnicities) &&
          errors.ethnicities.map((error, idx) =>
            error?.message ? (
              <p className="error" key={idx}>
                {error.message}
              </p>
            ) : null
          )}
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col">
          <TextInputField
            label="Min age"
            name="minAge"
            register={register}
            getValues={getValues}
            setValue={setValue}
            type="number"
            validation={{
              valueAsNumber: true,
              validate: {
                isAdult: (value: number) => {
                  if (value !== undefined && value !== null && value < 18) {
                    return "Min age should be greater than or equal to 18"
                  }
                  return true
                },
                lessThanMax: (value: number) => {
                  const formValues = getValues()
                  const maxAgeValue = Number(formValues.maxAge)
                  if (
                    value !== undefined &&
                    value !== null &&
                    !isNaN(maxAgeValue) &&
                    value > maxAgeValue
                  ) {
                    return "Min age must be less than or equal to max age"
                  }
                  return true
                },
              },
            }}
          />
          {errors.minAge && (
            <p className="error">
              {Array.isArray(errors.minAge) ? errors.minAge[0]?.message : "Invalid age"}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <TextInputField
            label="Max age"
            name="maxAge"
            register={register}
            getValues={getValues}
            setValue={setValue}
            type="number"
            validation={{
              valueAsNumber: true,
              validate: {
                greaterThanMin: (value: number) => {
                  const formValues = getValues()
                  const minAgeValue = Number(formValues.minAge)
                  if (
                    value !== undefined &&
                    value !== null &&
                    !isNaN(minAgeValue) &&
                    value < minAgeValue
                  ) {
                    return "Max age must be greater than or equal to min age"
                  }
                  return true
                },
              },
            }}
          />
          {errors.maxAge && (
            <p className="error">
              {Array.isArray(errors.maxAge) ? errors.maxAge[0]?.message : "Invalid age"}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
