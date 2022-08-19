import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, Textarea, GridCell } from "@bloom-housing/ui-components"

const AdditionalDetails = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <div>
      <GridSection
        columns={2}
        separator
        title={t("listings.sections.additionalDetails")}
        description={t("listings.sections.additionalDetailsSubtitle")}
      >
        <GridCell>
          <Textarea
            label={t("listings.requiredDocuments")}
            name={"requiredDocuments"}
            id={"requiredDocuments"}
            fullWidth={true}
            register={register}
            maxLength={2000}
          />
        </GridCell>
        <GridCell>
          <Textarea
            label={t("listings.importantProgramRules")}
            name={"programRules"}
            id={"programRules"}
            fullWidth={true}
            register={register}
            maxLength={600}
          />
        </GridCell>
        <GridCell>
          <Textarea
            label={t("listings.specialNotes")}
            name={"specialNotes"}
            id={"specialNotes"}
            fullWidth={true}
            register={register}
            maxLength={600}
          />
        </GridCell>
      </GridSection>
    </div>
  )
}

export default AdditionalDetails
