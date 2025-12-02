import React, { useContext } from "react"
import { useFormContext } from "react-hook-form"
import { Grid } from "@bloom-housing/ui-seeds"
import { FieldGroup, t, Textarea } from "@bloom-housing/ui-components"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { defaultFieldProps, getLabel } from "../../../../lib/helpers"
import {
  EnumListingListingType,
  FeatureFlagEnum,
  ListingDocuments,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AuthContext, listingRequiredDocumentsOptions } from "@bloom-housing/shared-helpers"

type AdditionalDetailsProps = {
  defaultText?: string
  existingDocuments: ListingDocuments
  requiredFields: string[]
}

const AdditionalDetails = (props: AdditionalDetailsProps) => {
  const formMethods = useFormContext()
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, clearErrors, watch } = formMethods

  const jurisdiction = watch("jurisdictions.id")
  const listingType = watch("listingType")

  const enableNonRegulatedListings = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableNonRegulatedListings,
    jurisdiction
  )

  const showRequiredDocumentsListField =
    enableNonRegulatedListings && listingType === EnumListingListingType.nonRegulated

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={t("listings.sections.additionalDetails")}
        subheading={t("listings.sections.additionalDetailsSubtitle")}
      >
        {showRequiredDocumentsListField && (
          <Grid.Row columns={1}>
            <Grid.Cell>
              <FieldGroup
                name={"selectedRequiredDocuments"}
                groupLabel={getLabel(
                  "selectedRequiredDocuments",
                  props.requiredFields,
                  t("listings.requiredDocuments")
                )}
                register={register}
                type="checkbox"
                fields={listingRequiredDocumentsOptions.map((key) => ({
                  id: key,
                  label: t(`listings.requiredDocuments.${key}`),
                  register,
                  defaultChecked: props.existingDocuments ? props.existingDocuments[key] : false,
                }))}
                fieldGroupClassName="grid grid-cols-2 mt-2"
              />
            </Grid.Cell>
          </Grid.Row>
        )}
        <Grid.Row columns={2}>
          <Grid.Cell>
            <Textarea
              id={"requiredDocuments"}
              fullWidth={true}
              register={register}
              maxLength={2000}
              placeholder={""}
              {...defaultFieldProps(
                "requiredDocuments",
                showRequiredDocumentsListField
                  ? t("listings.requiredDocumentsAdditionalInfo")
                  : t("listings.requiredDocuments"),
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
