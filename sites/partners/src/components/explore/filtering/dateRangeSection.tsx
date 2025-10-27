/* eslint-disable @typescript-eslint/unbound-method */
import React from "react"
import { UseFormMethods } from "react-hook-form"
import { DateField } from "@bloom-housing/ui-components"
import { FormValues } from "./mainForm"
import { HeadingGroup } from "@bloom-housing/ui-seeds"

interface Props {
  form: UseFormMethods<FormValues>
}

export function DateRangeSection({ form }: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form

  return (
    <section className="flex flex-col border-b pb-8">
      <HeadingGroup
        heading="Date Range"
        subheading="Set the date range for applications to include in the analysis"
      />
      <div className="flex flex-row gap-4">
        <div className="flex flex-col w-1/2">
          <DateField
            id="startDate"
            name="startDate"
            label="Start Date"
            register={register}
            required={false}
            setValue={setValue}
            watch={watch}
          />
          {errors?.startDate && (
            <span className="text-red-600 text-sm mt-1">{errors.startDate.message}</span>
          )}
        </div>

        <div className="flex flex-col w-1/2">
          <DateField
            id="endDate"
            name="endDate"
            label="End Date"
            register={register}
            required={false}
            setValue={setValue}
            watch={watch}
          />
          {errors?.endDate && (
            <span className="text-red-600 text-sm mt-1">{errors.endDate.message}</span>
          )}
        </div>
      </div>
    </section>
  )
}
