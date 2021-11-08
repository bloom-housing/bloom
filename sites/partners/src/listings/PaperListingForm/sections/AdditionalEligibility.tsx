import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, Textarea } from "@bloom-housing/ui-components"
import { fieldMessage } from "../../../../lib/helpers"

const AdditionalEligibility = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, clearErrors } = formMethods

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
          />
          <Textarea
            label={t("listings.rentalHistory")}
            name={"rentalHistory"}
            id={"rentalHistory"}
            fullWidth={true}
            register={register}
          />
        </GridSection>
        <GridSection columns={2}>
          <Textarea
            label={t("listings.criminalBackground")}
            name={"criminalBackground"}
            id={"criminalBackground"}
            fullWidth={true}
            register={register}
          />
          <Textarea
            label={t("listings.sections.rentalAssistanceTitle")}
            name={"rentalAssistance"}
            id={"rentalAssistance"}
            fullWidth={true}
            register={register}
            errorMessage={fieldMessage(errors?.rentalAssistance)}
            inputProps={{
              onChange: () => clearErrors("rentalAssistance"),
            }}
          />
        </GridSection>
      </GridSection>
    </div>
  )
}

export default AdditionalEligibility
