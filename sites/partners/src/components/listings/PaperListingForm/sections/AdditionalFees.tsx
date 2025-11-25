import React, { useContext, useMemo, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { t, Field, Textarea, FieldGroup } from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import { defaultFieldProps } from "../../../../lib/helpers"
import { AuthContext, listingUtilities } from "@bloom-housing/shared-helpers"
import {
  EnumListingDepositType,
  EnumListingListingType,
  FeatureFlagEnum,
  ListingUtilities,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import styles from "../ListingForm.module.scss"
import { GridRow } from "@bloom-housing/ui-seeds/src/layout/Grid"
import { ListingContext } from "../../ListingContext"

type AdditionalFeesProps = {
  existingUtilities: ListingUtilities
  requiredFields: string[]
}

const AdditionalFees = (props: AdditionalFeesProps) => {
  const formMethods = useFormContext()
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)
  const listing = useContext(ListingContext)
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors, clearErrors, setValue } = formMethods
  const jurisdiction = watch("jurisdictions.id")
  const depositType = watch("depositType")
  const listingType = watch("listingType")

  const utilitiesFields = useMemo(() => {
    return listingUtilities.map((utility) => {
      return {
        id: utility,
        label: t(`listings.utilities.${utility}`),
        defaultChecked: props.existingUtilities ? props.existingUtilities[utility] : false,
        register,
      }
    })
  }, [props.existingUtilities, register])

  const enableUtilitiesIncluded = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableUtilitiesIncluded,
    jurisdiction
  )

  const enableNonRegulatedListings = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableNonRegulatedListings,
    jurisdiction
  )

  const enableCreditScreeningFee = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableCreditScreeningFee,
    jurisdiction
  )

  useEffect(() => {
    // clear the utilities values if the new jurisdiction doesn't have utilities included functionality
    if (!enableUtilitiesIncluded) {
      setValue("utilities", undefined)
    }
  }, [enableUtilitiesIncluded, setValue])

  // After submitting the deposit max, min, and value can be removed via AdditionalMetadataFormatter.
  // On a save and continue flow the values need to be updated in the form
  useEffect(() => {
    setValue("depositMax", listing?.depositMax)
    setValue("depositMin", listing?.depositMin)
    setValue("depositValue", listing?.depositValue)
  }, [listing?.depositMax, listing?.depositMin, listing?.depositValue, setValue])

  const showAsNonRegulated =
    enableNonRegulatedListings && listingType === EnumListingListingType.nonRegulated

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={t("listings.sections.additionalFees")}
        subheading={t("listings.sections.additionalFeesSubtitle")}
      >
        <Grid.Row columns={showAsNonRegulated ? 2 : 3}>
          <Grid.Cell>
            <Field
              register={register}
              type={"currency"}
              prepend={"$"}
              {...defaultFieldProps(
                "applicationFee",
                t("listings.applicationFee"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
          {!showAsNonRegulated && (
            <>
              <Grid.Cell>
                <Field
                  register={register}
                  type={"number"}
                  prepend={"$"}
                  {...defaultFieldProps(
                    "depositMin",
                    t("listings.depositMin"),
                    props.requiredFields,
                    errors,
                    clearErrors
                  )}
                />
              </Grid.Cell>
              <Grid.Cell>
                <Field
                  register={register}
                  type={"number"}
                  prepend={"$"}
                  {...defaultFieldProps(
                    "depositMax",
                    t("listings.depositMax"),
                    props.requiredFields,
                    errors,
                    clearErrors
                  )}
                />
              </Grid.Cell>
            </>
          )}
        </Grid.Row>
        {showAsNonRegulated && (
          <>
            <GridRow>
              <Grid.Cell>
                <FieldGroup
                  register={register}
                  type="radio"
                  name="depositType"
                  groupLabel={t("listings.depositTitle")}
                  fields={[
                    {
                      id: "depositTypeFixed",
                      label: t("listings.depositFixed"),
                      value: EnumListingDepositType.fixedDeposit,
                      defaultChecked: !depositType,
                    },
                    {
                      id: "depositTypeRange",
                      label: t("listings.depositRange"),
                      value: EnumListingDepositType.depositRange,
                    },
                  ]}
                />
              </Grid.Cell>
            </GridRow>
            <Grid.Row columns={2}>
              {depositType === EnumListingDepositType.fixedDeposit && (
                <Grid.Cell>
                  <Field
                    type={"number"}
                    prepend={"$"}
                    register={register}
                    {...defaultFieldProps(
                      "depositValue",
                      t("listings.depositValue"),
                      props.requiredFields,
                      errors,
                      clearErrors
                    )}
                  />
                </Grid.Cell>
              )}
              {depositType === EnumListingDepositType.depositRange && (
                <>
                  <Grid.Cell>
                    <Field
                      type={"number"}
                      prepend={"$"}
                      register={register}
                      {...defaultFieldProps(
                        "depositMin",
                        t("listings.depositMin"),
                        props.requiredFields,
                        errors,
                        clearErrors
                      )}
                    />
                  </Grid.Cell>
                  <Grid.Cell>
                    <Field
                      type={"number"}
                      prepend={"$"}
                      register={register}
                      {...defaultFieldProps(
                        "depositMax",
                        t("listings.depositMax"),
                        props.requiredFields,
                        errors,
                        clearErrors
                      )}
                    />
                  </Grid.Cell>
                </>
              )}
            </Grid.Row>
          </>
        )}
        <Grid.Row>
          <Grid.Cell>
            <Textarea
              aria-describedby={"depositHelperText"}
              fullWidth={true}
              register={register}
              placeholder={""}
              {...defaultFieldProps(
                "depositHelperText",
                t("listings.sections.depositHelperText"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Textarea
              aria-describedby={"costsNotIncluded"}
              fullWidth={true}
              register={register}
              placeholder={""}
              {...defaultFieldProps(
                "costsNotIncluded",
                t("listings.sections.costsNotIncluded"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
        </Grid.Row>
        {enableCreditScreeningFee && jurisdiction && (
          <Grid.Row columns={3}>
            <Grid.Cell>
              <Field
                register={register}
                type={"currency"}
                prepend={"$"}
                {...defaultFieldProps(
                  "creditScreeningFee",
                  t("listings.sections.creditScreeningFee"),
                  props.requiredFields,
                  errors,
                  clearErrors
                )}
              />
            </Grid.Cell>
          </Grid.Row>
        )}
        {enableUtilitiesIncluded && (
          <Grid.Row>
            <Grid.Cell>
              <FieldGroup
                type="checkbox"
                name="utilities"
                groupLabel={t("listings.sections.utilities")}
                fields={utilitiesFields}
                register={register}
                fieldGroupClassName="grid grid-cols-2 mt-2"
                fieldLabelClassName={styles["label-option"]}
              />
            </Grid.Cell>
          </Grid.Row>
        )}
      </SectionWithGrid>
    </>
  )
}

export default AdditionalFees
