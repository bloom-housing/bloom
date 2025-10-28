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
            validate: (_value: string[]) => {
              // Allow empty selection for filtering - means no filter applied
              return true
            },
          }}
        />
        {errors.races && (
          <p className="error">{(errors.races as unknown as { message: string }).message}</p>
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
            validate: (_value: string[]) => {
              // Allow empty selection for filtering - means no filter applied
              return true
            },
          }}
        />
        {errors.ethnicities && (
          <p className="error">{(errors.ethnicities as unknown as { message: string }).message}</p>
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
                isAdult: (value: string) => {
                  if (value !== undefined && value !== null && value !== "" && Number(value) < 18) {
                    return "Min age should be greater than or equal to 18"
                  }
                  return true
                },
                lessThanMax: (value: string) => {
                  // If minAge is not provided, validation passes
                  if (value === undefined || value === null || value === "") {
                    return true
                  }

                  const formValues = getValues()
                  const maxAgeValue = Number(formValues.maxAge)

                  // If maxAge is not provided or is invalid, validation passes
                  if (maxAgeValue === undefined || isNaN(maxAgeValue)) {
                    return true
                  }

                  // If both ages are provided, minAge must be <= maxAge
                  if (Number(value) > maxAgeValue) {
                    return "Min age must be less than or equal to max age"
                  }

                  return true
                },
              },
            }}
          />
          {errors.minAge && (
            <p className="error">{(errors.minAge as unknown as { message: string }).message}</p>
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
                greaterThanMin: (value: string) => {
                  // If maxAge is not provided, validation passes
                  if (value === undefined || value === null || value === "") {
                    return true
                  }

                  const formValues = getValues()
                  const minAgeValue = Number(formValues.minAge)

                  // If minAge is not provided or is invalid, validation passes
                  if (minAgeValue === undefined || isNaN(minAgeValue)) {
                    return true
                  }

                  // If maxAge is provided, it must be >= minAge
                  if (Number(value) < minAgeValue) {
                    return "Max age must be greater than or equal to min age"
                  }

                  return true
                },
              },
            }}
          />
          {errors.maxAge && (
            <p className="error">{(errors.maxAge as unknown as { message: string }).message}</p>
          )}
        </div>
      </div>
    </section>
  )
}
