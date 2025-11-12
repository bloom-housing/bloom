import React, { useContext } from "react"
import { useFormContext } from "react-hook-form"
import {
  EnumListingListingType,
  FeatureFlagEnum,
  Jurisdiction,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t, Field, SelectOption, Select, FieldGroup } from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import {
  fieldMessage,
  fieldHasError,
  fieldIsRequired,
  defaultFieldProps,
} from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import styles from "../ListingForm.module.scss"
import { AuthContext } from "@bloom-housing/shared-helpers"

interface ListingIntroProps {
  jurisdictions: Jurisdiction[]
  requiredFields: string[]
}

const ListingIntro = (props: ListingIntroProps) => {
  const formMethods = useFormContext()
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, clearErrors, errors, watch, getValues } = formMethods
  const jurisdiction = watch("jurisdictions.id")

  const listing = getValues()

  const listingType = watch("listingType")

  const enableNonRegulatedListings = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableNonRegulatedListings,
    jurisdiction
  )

  const enableHousingDeveloperOwner = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableHousingDeveloperOwner,
    jurisdiction
  )

  const jurisdictionOptions: SelectOption[] = [
    { label: "", value: "" },
    ...props.jurisdictions.map((jurisdiction) => ({
      label: jurisdiction.name,
      value: jurisdiction.id,
    })),
  ]

  const defaultJurisdiction = props.jurisdictions.length === 1 ? props.jurisdictions[0].id : ""

  let developerFieldTitle = t("listings.developer")
  if (enableHousingDeveloperOwner) {
    developerFieldTitle = t("listings.housingDeveloperOwner")
  } else if (listingType === EnumListingListingType.regulated || !enableNonRegulatedListings) {
    developerFieldTitle = t("listings.developer")
  } else {
    developerFieldTitle = t("listings.propertyManager")
  }

  return (
    <>
      <SectionWithGrid
        heading={t("listings.sections.introTitle")}
        subheading={t("listings.sections.introSubtitle")}
      >
        {enableNonRegulatedListings && (
          <Grid.Row columns={1}>
            <Grid.Cell>
              <FieldGroup
                name="listingType"
                type="radio"
                register={register}
                groupLabel={t("listings.listingTypeTile")}
                fields={[
                  {
                    id: "regulatedListing",
                    label: t("listings.regulatedListing"),
                    value: EnumListingListingType.regulated,
                    defaultChecked: !listing?.listingType,
                  },
                  {
                    id: "nonRegulatedListing",
                    label: t("listings.nonRegulatedListing"),
                    value: EnumListingListingType.nonRegulated,
                  },
                ]}
                error={fieldHasError(errors.listingType)}
                errorMessage={fieldMessage(errors.listingType)}
              />
            </Grid.Cell>
          </Grid.Row>
        )}
        <Grid.Row columns={1}>
          <Grid.Cell>
            <Field
              register={register}
              dataTestId={"nameField"}
              {...defaultFieldProps(
                "name",
                t("listings.listingName"),
                props.requiredFields,
                errors,
                clearErrors,
                true
              )}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row columns={2}>
          <div className={`${defaultJurisdiction ? "hidden" : ""}`}>
            <Grid.Cell>
              <Select
                id={"jurisdictions.id"}
                defaultValue={defaultJurisdiction}
                name={"jurisdictions.id"}
                label={
                  <span>
                    {t("t.jurisdiction")}
                    <span className={styles["asterisk"]}>{` ${"*"}`}</span>
                  </span>
                }
                register={register}
                controlClassName={`control ${defaultJurisdiction ? "hidden" : ""}`}
                error={
                  fieldHasError(errors?.jurisdictions) ||
                  fieldHasError(errors?.["jurisdictions.id"])
                }
                errorMessage={
                  fieldMessage(errors?.jurisdictions) ??
                  fieldMessage(errors?.["jurisdictions.id"]) ??
                  undefined
                }
                keyPrefix={"jurisdictions"}
                options={jurisdictionOptions}
                inputProps={{
                  onChange: () => {
                    if (
                      fieldHasError(errors?.jurisdictions) ||
                      fieldHasError(errors?.["jurisdictions.id"])
                    ) {
                      clearErrors("jurisdictions.id")
                      clearErrors("jurisdictions")
                    }
                  },
                  "aria-required": fieldIsRequired("jurisdictions", props.requiredFields),
                }}
              />
            </Grid.Cell>
          </div>
          <Grid.Cell>
            <Field
              register={register}
              {...defaultFieldProps(
                "developer",
                developerFieldTitle,
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
        </Grid.Row>
        {listingType === EnumListingListingType.nonRegulated && enableNonRegulatedListings && (
          <Grid.Row columns={1}>
            <Grid.Cell>
              <FieldGroup
                name="listingHasHudEbllClearance"
                type="radio"
                register={register}
                groupLabel={t("listings.hasEbllClearanceTitle")}
                fields={[
                  {
                    id: "listingHasHudEbllClearanceYes",
                    label: t("t.yes"),
                    value: YesNoEnum.yes,
                    defaultChecked: listing?.hasHudEbllClearance,
                  },
                  {
                    id: "listingHasHudEbllClearanceNo",
                    label: t("t.no"),
                    value: YesNoEnum.no,
                    defaultChecked: !listing?.hasHudEbllClearance,
                  },
                ]}
                error={fieldHasError(errors.listingHasHudEbllClearance)}
                errorMessage={fieldMessage(errors.listingHasHudEbllClearance)}
              />
            </Grid.Cell>
          </Grid.Row>
        )}
      </SectionWithGrid>
    </>
  )
}

export default ListingIntro
