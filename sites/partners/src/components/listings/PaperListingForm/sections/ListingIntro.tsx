import React from "react"
import { useFormContext } from "react-hook-form"
import {
  EnumListingListingType,
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

interface ListingIntroProps {
  jurisdictions: Jurisdiction[]
  requiredFields: string[]
  enableNonRegulatedListings?: boolean
}

const ListingIntro = (props: ListingIntroProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, clearErrors, errors, getValues } = formMethods
  const listing = getValues()

  const jurisdictionOptions: SelectOption[] = [
    { label: "", value: "" },
    ...props.jurisdictions.map((jurisdiction) => ({
      label: jurisdiction.name,
      value: jurisdiction.id,
    })),
  ]

  const defaultJurisdiction = props.jurisdictions.length === 1 ? props.jurisdictions[0].id : ""

  return (
    <>
      <SectionWithGrid
        heading={t("listings.sections.introTitle")}
        subheading={t("listings.sections.introSubtitle")}
      >
        {props.enableNonRegulatedListings && (
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
                t("listings.developer"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Cell>
            <FieldGroup
              name="hasEbllClearance"
              type="radio"
              register={register}
              groupLabel={t("listings.hasEbllClearanceTitle")}
              fields={[
                {
                  id: "ebllYes",
                  label: t("t.yes"),
                  value: YesNoEnum.yes,
                  defaultChecked: listing?.hasEbllClearance === true,
                },
                {
                  id: "ebllNo",
                  label: t("t.no"),
                  value: YesNoEnum.no,
                  defaultChecked: listing?.hasEbllClearance === false,
                },
              ]}
              error={fieldHasError(errors.hasEbllClearance)}
              errorMessage={fieldMessage(errors.hasEbllClearance)}
            />
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export default ListingIntro
