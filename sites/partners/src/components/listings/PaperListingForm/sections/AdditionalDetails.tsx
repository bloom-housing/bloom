import React from "react"
import { useFormContext } from "react-hook-form"
import { Grid } from "@bloom-housing/ui-seeds"
import { FieldGroup, t, Textarea } from "@bloom-housing/ui-components"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { defaultFieldProps } from "../../../../lib/helpers"
import styles from "../ListingForm.module.scss"

type AdditionalDetailsProps = {
  defaultText?: string
  requiredFields: string[]
}
enum RequiredDocumentEnum {
  "socialSecurityCard" = "socialSecurityCard",
  "currentLandlordReference" = "currentLandlordReference",
  "birthCertificate" = "birthCertificate",
  "previousLandlordReference" = "previousLandlordReference",
  "governmentIssuedId" = "governmentIssuedId",
  "proofOfAssets" = "proofOfAssets",
  "proofOfIncome" = "proofOfIncome",
  "residencyDocuments" = "residencyDocuments",
  "proofOfCustody" = "proofOfCustody",
}

const AdditionalDetails = (props: AdditionalDetailsProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, clearErrors, watch } = formMethods

  const jurisdiction = watch("jurisdictions.id")

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={t("listings.sections.additionalDetails")}
        subheading={t("listings.sections.additionalDetailsSubtitle")}
      >
        <Grid.Row columns={1}>
          <Grid.Cell>
            <FieldGroup
              name={"requiredDocuments"}
              groupLabel={
                <span>
                  {t("listings.requiredDocuments")}
                  {jurisdiction && <span className={styles["asterisk"]}>{` ${"*"}`}</span>}
                </span>
              }
              register={register}
              type="checkbox"
              fields={Object.keys(RequiredDocumentEnum).map((key) => ({
                id: `requiredDocuments.${key}`,
                label: t(`listings.requiredDocuments.${key}`),
                value: key,
              }))}
              fieldGroupClassName="grid grid-cols-2 mt-2"
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
                "programRules",
                t("listings.importantProgramRules"),
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
