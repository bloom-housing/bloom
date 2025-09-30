/* eslint-disable @typescript-eslint/unbound-method */
import React from "react"
import { UseFormMethods } from "react-hook-form"
import { MultiSelectField } from "@bloom-housing/ui-components"
import { dropdownOptions } from "./options"
import { FormValues } from "./mainForm"
import { HeadingGroup } from "@bloom-housing/ui-seeds"

interface Props {
  form: UseFormMethods<FormValues>
}

export function GeographySection({ form }: Props) {
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = form

  return (
    <section className="flex flex-col py-8">
      <HeadingGroup
        heading="Geography"
        subheading="Set the geographic boundaries based on primary applicant addresses"
      />

      <div className="sub-section w-1/2">
        <h5>Applicant residential address</h5>
        <MultiSelectField
          label="County"
          name="applicantResidentialCounties"
          dataSource={dropdownOptions.counties}
          register={register}
          getValues={getValues}
          setValue={setValue}
          placeholder="Select county"
          validation={{
            validate: (value: string[]) => {
              if (value.length > 0) {
                return true
              }
              return "Must select at least one county if filtering"
            },
          }}
        />
        {errors.applicantResidentialCounties && (
          <p className="error">
            {(errors.applicantResidentialCounties as unknown as { message: string }).message}
          </p>
        )}
      </div>

      <div className="sub-section w-1/2 py-6">
        <h5>Applicant work address</h5>
        <MultiSelectField
          label="County"
          name="applicantWorkCounties"
          dataSource={dropdownOptions.counties}
          register={register}
          getValues={getValues}
          setValue={setValue}
          placeholder="Select county"
          validation={{
            validate: (value: string[]) => {
              if (value.length > 0) {
                return true
              }
              return "Must select at least one county if filtering"
            },
          }}
        />
        {errors.applicantWorkCounties && (
          <p className="error">
            {(errors.applicantWorkCounties as unknown as { message: string }).message}
          </p>
        )}
      </div>
    </section>
  )
}
