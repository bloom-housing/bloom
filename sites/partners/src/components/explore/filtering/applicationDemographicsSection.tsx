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
        <TextInputField
          label="Min age"
          name="minAge"
          register={register}
          getValues={getValues}
          setValue={setValue}
          type="number"
          validation={{ valueAsNumber: true }}
        />
        {Array.isArray(errors.minAge) &&
          errors.minAge.map((error, idx) =>
            error?.message ? (
              <p className="error" key={idx}>
                {error.message}
              </p>
            ) : null
          )}

        <TextInputField
          label="Max age"
          name="maxAge"
          register={register}
          getValues={getValues}
          setValue={setValue}
          type="number"
          validation={{ valueAsNumber: true }}
        />
        {Array.isArray(errors.ethnicities) &&
          errors.maxAge.map((error, idx) =>
            error?.message ? (
              <p className="error" key={idx}>
                {error.message}
              </p>
            ) : null
          )}
      </div>
    </section>
  )
}
