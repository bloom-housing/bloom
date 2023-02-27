import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, Textarea } from "@bloom-housing/ui-components"

const AdditionalEligibility = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <div>
      <GridSection
        grid={false}
        separator
        title={t("listings.sections.additionalEligibilityTitle")}
        description={t("listings.sections.additionalEligibilitySubtext")}
      >
        <GridSection columns={2}>
          <Textarea
            label={t("listings.creditHistory")}
            name={"creditHistory"}
            id={"creditHistory"}
            fullWidth={true}
            register={register}
            maxLength={2000}
          />
          <Textarea
            label={t("listings.rentalHistory")}
            name={"rentalHistory"}
            id={"rentalHistory"}
            fullWidth={true}
            register={register}
            maxLength={2000}
          />
        </GridSection>
        <GridSection columns={2}>
          <Textarea
            label={t("listings.criminalBackground")}
            name={"criminalBackground"}
            id={"criminalBackground"}
            fullWidth={true}
            register={register}
            maxLength={2000}
          />
        </GridSection>
      </GridSection>
    </div>
  )
}

export default AdditionalEligibility
