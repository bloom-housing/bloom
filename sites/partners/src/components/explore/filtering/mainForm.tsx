import React from "react"
import { useForm, FormProvider } from "react-hook-form"
import { HouseholdDetailsSection } from "./housingDetailsSection"
import { ApplicationDemographicsSection } from "./applicationDemographicsSection"
import { GeographySection } from "./geographySection"
import { DateRangeSection } from "./dateRangeSection"
import { Button } from "@bloom-housing/ui-seeds"

export type FormValues = {
  householdSize: string[]
  minIncome?: number
  maxIncome?: number
  amiLevels: string[]
  voucherStatuses: string[]
  accessibilityTypes: string[]
  races: string[]
  ethnicities: string[]
  applicantResidentialCounties: string[]
  applicantWorkCounties: string[]
  minAge?: number
  maxAge?: number
  startDate?: string
  endDate?: string
}

interface MainFormProps {
  onClose: () => void
  onApplyFilters?: (filters: FormValues) => void
}

export const MainForm = ({ onClose, onApplyFilters }: MainFormProps) => {
  const methods = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      householdSize: ["all"],
      amiLevels: ["all"],
      voucherStatuses: ["any"],
      accessibilityTypes: ["all"],
      races: ["all"],
      ethnicities: ["all"],
      applicantResidentialCounties: ["all"],
      applicantWorkCounties: ["all"],
      minAge: 18,
      maxAge: undefined,
      startDate: "",
      endDate: "",
      minIncome: undefined,
      maxIncome: undefined,
    },
  })

  // Add validation rules for date fields
  React.useEffect(() => {
    methods.register("startDate", {
      validate: (value: string) => {
        console.log("startDate", value)
        if (!value) return true // Allow empty dates

        const endDateValue = methods.getValues("endDate")
        if (endDateValue && new Date(value) > new Date(endDateValue)) {
          return "Start date must be before or equal to end date"
        }
        return true
      },
    })

    methods.register("endDate", {
      validate: (value: string) => {
        console.log("endDate", value)
        if (!value) return true // Allow empty dates

        const startDateValue = methods.getValues("startDate")
        if (startDateValue && new Date(value) < new Date(startDateValue)) {
          return "End date must be after or equal to start date"
        }
        return true
      },
    })
  }, [methods])

  const onSubmit = (data: FormValues) => {
    // Check if there are any validation errors
    const hasErrors = Object.keys(methods.formState.errors).length > 0

    if (hasErrors) {
      // Don't submit if there are validation errors
      console.error("Form has validation errors:", methods.formState.errors)
      return
    }

    console.log(data)

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
