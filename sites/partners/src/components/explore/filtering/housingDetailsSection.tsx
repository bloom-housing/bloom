/* eslint-disable @typescript-eslint/unbound-method */
import React from "react"
import { UseFormMethods } from "react-hook-form"
import { MultiSelectField, Field as TextInputField } from "@bloom-housing/ui-components"
import { dropdownOptions } from "./options"
import { FormValues } from "./mainForm"
import { HeadingGroup } from "@bloom-housing/ui-seeds"

interface Props {
  form: UseFormMethods<FormValues>
}

export function HouseholdDetailsSection({ form }: Props) {
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = form

  return (
    <section className="flex flex-col border-b pb-8">
      <HeadingGroup
        heading="Self reported household details"
        subheading="Select the settings for self reported income, size and household details"
      />
      <div className="pb-6">
        <MultiSelectField
          label="Household size"
          name="householdSize"
          dataSource={dropdownOptions.householdSizes}
          register={register}
          getValues={getValues}
          setValue={setValue}
          placeholder="Select one or more household size"
          validation={{ required: "Please select at least one size" }}
        />
        {Array.isArray(errors.householdSize) &&
          errors.householdSize.map((err, idx) =>
            err?.message ? (
              <p className="error" key={idx}>
                {err.message}
              </p>
            ) : null
          )}
      </div>
      <div className="flex flex-col pb-6">
        <div className="flex">
          <TextInputField
            label="Min income"
            name="minIncome"
            register={register}
            getValues={getValues}
            setValue={setValue}
            type="currency"
            prepend="$"
            validation={{ valueAsNumber: true }}
          />
          <TextInputField
            label="Max income"
            name="maxIncome"
            register={register}
            getValues={getValues}
            setValue={setValue}
            type="currency"
            prepend="$"
            validation={{ valueAsNumber: true }}
          />
        </div>
        {(errors.minIncome || errors.maxIncome) && (
          <p className="error">{errors.minIncome?.message || errors.maxIncome?.message}</p>
        )}
      </div>
      <div className="pb-6">
        <MultiSelectField
          label="AMI %"
          name="amiLevels"
          dataSource={dropdownOptions.amiLevels}
          register={register}
          getValues={getValues}
          setValue={setValue}
          placeholder="Select one or more AMI level"
        />
        {Array.isArray(errors.amiLevels) &&
          errors.amiLevels.map((err, idx) =>
            err?.message ? (
              <p className="error" key={idx}>
                {err.message}
              </p>
            ) : null
          )}
      </div>

      <div className="pb-6">
        <MultiSelectField
          label="Subsidy voucher status"
          name="voucherStatuses"
          dataSource={dropdownOptions.voucherStatuses}
          register={register}
          getValues={getValues}
          setValue={setValue}
          placeholder="Select voucher status"
        />
        {Array.isArray(errors.voucherStatuses) &&
          errors.voucherStatuses.map((err, idx) =>
            err?.message ? (
              <p className="error" key={idx}>
                {err.message}
              </p>
            ) : null
          )}
      </div>
      <div className="">
        <MultiSelectField
          label="Accessibility"
          name="accessibilityTypes"
          dataSource={dropdownOptions.accessibilityTypes}
          register={register}
          getValues={getValues}
          setValue={setValue}
          placeholder="Select accessibility type"
        />
        {Array.isArray(errors.accessibilityTypes) &&
          errors.accessibilityTypes.map((err, idx) =>
            err?.message ? (
              <p className="error" key={idx}>
                {err.message}
              </p>
            ) : null
          )}
      </div>
    </section>
  )
}
