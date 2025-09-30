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
    <section className="flex flex-col border-b py-8">
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
          validation={{
            validate: (value: string[]) => {
              console.log(value)
              if (value.length > 0) {
                return true
              }
              return "Please select at least one household size"
            },
          }}
        />
        {errors.householdSize && (
          <p className="error">
            {(errors.householdSize as unknown as { message: string }).message}
          </p>
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
            validation={{
              valueAsNumber: true,
              validate: {
                lessThanMax: (value: number) => {
                  const maxIncomeValue = getValues("maxIncome")
                  if (
                    value !== undefined &&
                    value !== null &&
                    maxIncomeValue !== undefined &&
                    maxIncomeValue !== null &&
                    value > maxIncomeValue
                  ) {
                    return "Min income must be less than or equal to max income"
                  }
                  return true
                },
              },
            }}
          />
          <TextInputField
            label="Max income"
            name="maxIncome"
            register={register}
            getValues={getValues}
            setValue={setValue}
            type="currency"
            prepend="$"
            validation={{
              valueAsNumber: true,
              validate: {
                greaterThanMin: (value: number) => {
                  const minIncomeValue = getValues("minIncome")
                  if (
                    value !== undefined &&
                    value !== null &&
                    minIncomeValue !== undefined &&
                    minIncomeValue !== null &&
                    value < minIncomeValue
                  ) {
                    return "Max income must be greater than or equal to min income"
                  }
                  return true
                },
              },
            }}
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
          validation={{
            validate: (value: string[]) => {
              if (value.length > 0) {
                return true
              }
              return "Please select at least one AMI level"
            },
          }}
        />
        {errors.amiLevels && (
          <p className="error">{(errors.amiLevels as unknown as { message: string }).message}</p>
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
          validation={{
            validate: (value: string[]) => {
              if (value.length > 0) {
                return true
              }
              return "Please select at least one voucher status"
            },
          }}
        />
        {errors.voucherStatuses && (
          <p className="error">
            {(errors.voucherStatuses as unknown as { message: string }).message}
          </p>
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
          validation={{
            validate: (value: string[]) => {
              if (value.length > 0) {
                return true
              }
              return "Please select at least one accessibility type"
            },
          }}
        />
        {errors.accessibilityTypes && (
          <p className="error">
            {(errors.accessibilityTypes as unknown as { message: string }).message}
          </p>
        )}
      </div>
    </section>
  )
}
