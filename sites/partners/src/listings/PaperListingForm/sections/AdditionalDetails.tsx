import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, Textarea } from "@bloom-housing/ui-components"

const AdditionalDetails = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <div>
      <GridSection grid={false} separator>
        <span className="form-section__title">{t("listings.additionalDetails")}</span>
        <span className="form-section__description">{t("listings.additionalDetailsSubtext")} </span>
        <GridSection columns={2}>
          <Textarea
            label={t("listings.requiredDocuments")}
            name={"requiredDocuments"}
            id={"requiredDocuments"}
            fullWidth={true}
            register={register}
          />
          <Textarea
            label={t("listings.importantProgramRules")}
            name={"programRules"}
            id={"programRules"}
            fullWidth={true}
            register={register}
          />
        </GridSection>
        <GridSection columns={2}>
          <Textarea
            label={t("listings.specialNotes")}
            name={"specialNotes"}
            id={"specialNotes"}
            fullWidth={true}
            register={register}
          />
        </GridSection>
      </GridSection>
    </div>
  )
}

export default AdditionalDetails
