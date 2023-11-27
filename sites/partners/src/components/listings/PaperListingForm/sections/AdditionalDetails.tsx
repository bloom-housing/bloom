import React from "react"
import { useFormContext } from "react-hook-form"
import { Grid } from "@bloom-housing/ui-seeds"
import { t, Textarea } from "@bloom-housing/ui-components"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const AdditionalDetails = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={t("listings.sections.additionalDetails")}
        subheading={t("listings.sections.additionalDetailsSubtitle")}
      >
        <Grid.Row columns={2}>
          <Grid.Cell>
            <Textarea
              label={t("listings.requiredDocuments")}
              name={"requiredDocuments"}
              id={"requiredDocuments"}
              fullWidth={true}
              register={register}
              maxLength={2000}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Textarea
              label={t("listings.importantProgramRules")}
              name={"programRules"}
              id={"programRules"}
              fullWidth={true}
              register={register}
              maxLength={600}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Cell>
            <Textarea
              label={t("listings.specialNotes")}
              name={"specialNotes"}
              id={"specialNotes"}
              fullWidth={true}
              register={register}
              maxLength={600}
            />
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export default AdditionalDetails
