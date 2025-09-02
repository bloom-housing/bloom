import React from "react"
import { useForm, FormProvider } from "react-hook-form"
import { HouseholdDetailsSection } from "./housingDetailsSection"
import { ApplicationDemographicsSection } from "./applicationDemographicsSection"
import { GeographySection } from "./geographySection"
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
  propertyCounties: string[]
  propertyCities: string[]
  applicantResidentialCounties: string[]
  applicantWorkCounties: string[]
  minAge: string[]
  maxAge: string[]
}

export const MainForm = ({ onClose }: { onClose: () => void }) => {
  const methods = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      householdSize: [],
      amiLevels: [],
      voucherStatuses: [],
      accessibilityTypes: [],
      races: [],
      ethnicities: [],
      propertyCounties: [],
      propertyCities: [],
      applicantResidentialCounties: [],
      applicantWorkCounties: [],
      minAge: [],
      maxAge: [],
    },
  })

  const onSubmit = (data: FormValues) => {
    console.log("submitted:", data)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="flex-1 overflow-y-auto p-6">
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
