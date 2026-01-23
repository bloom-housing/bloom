import React from "react"
import { useForm, FormProvider } from "react-hook-form"
import { HouseholdDetailsSection } from "./housingDetailsSection"
import { ApplicationDemographicsSection } from "./applicationDemographicsSection"
import { GeographySection } from "./geographySection"
import { DateRangeSection } from "./dateRangeSection"
import { Button } from "@bloom-housing/ui-seeds"
import { FORM_DEFAULT_VALUES } from "../../../lib/explore/filterDefaults"
import { FormValues } from "../../../lib/explore/filterTypes"

interface MainFormProps {
  onClose: () => void
  onApplyFilters?: (filters: FormValues) => void
}

export const MainForm = ({ onClose, onApplyFilters }: MainFormProps) => {
  const methods = useForm<FormValues>({
    mode: "onChange",
    defaultValues: FORM_DEFAULT_VALUES,
  })

  const onSubmit = (data: FormValues) => {
    // Check if there are any validation errors
    const hasErrors = Object.keys(methods.formState.errors).length > 0

    if (hasErrors) {
      // Don't submit if there are validation errors
      console.error("Form has validation errors:", methods.formState.errors)
      return
    }

    if (onApplyFilters) {
      onApplyFilters(data)
    }
    onClose()
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="flex-1 overflow-y-auto p-6">
          <DateRangeSection form={methods} />
          <HouseholdDetailsSection form={methods} />
          <ApplicationDemographicsSection form={methods} />
          <GeographySection form={methods} />
        </div>

        <div className="flex gap-4 p-6 border-t border-gray-200">
          <Button variant="primary" type="submit">
            Apply Filters
          </Button>
          <Button variant="primary-outlined" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
