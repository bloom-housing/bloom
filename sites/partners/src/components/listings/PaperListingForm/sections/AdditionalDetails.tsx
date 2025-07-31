import React from "react"
import { useFormContext } from "react-hook-form"
import { Grid } from "@bloom-housing/ui-seeds"
import { t, Textarea } from "@bloom-housing/ui-components"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { defaultFieldProps } from "../../../../lib/helpers"

type AdditionalDetailsProps = {
  defaultText?: string
  requiredFields: string[]
}

const AdditionalDetails = (props: AdditionalDetailsProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, clearErrors } = formMethods

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
              placeholder={""}
              {...defaultFieldProps(
                "requiredDocuments",
                t("listings.requiredDocuments"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Textarea
              fullWidth={true}
              register={register}
              maxLength={600}
              placeholder={""}
              {...defaultFieldProps(
                "programRules",
                t("listings.importantProgramRules"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Cell>
            <Textarea
              fullWidth={true}
              register={register}
              maxLength={600}
              placeholder={""}
              {...defaultFieldProps(
                "specialNotes",
                t("listings.specialNotes"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export default AdditionalDetails
