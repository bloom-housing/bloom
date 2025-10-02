import React, { useContext, useMemo, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { t, Field, Textarea, FieldGroup } from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import { defaultFieldProps } from "../../../../lib/helpers"
import { AuthContext, listingUtilities } from "@bloom-housing/shared-helpers"
import {
  EnumListingDepositType,
  FeatureFlagEnum,
  ListingUtilities,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import styles from "../ListingForm.module.scss"
import { GridRow } from "@bloom-housing/ui-seeds/src/layout/Grid"

type AdditionalFeesProps = {
  existingUtilities: ListingUtilities
  requiredFields: string[]
}

const AdditionalFees = (props: AdditionalFeesProps) => {
  const formMethods = useFormContext()
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors, clearErrors, setValue } = formMethods

  const jurisdiction = watch("jurisdictions.id")
  const depositType = watch("depositType")

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

  useEffect(() => {
    // clear the utilities values if the new jurisdiction doesn't have utilities included functionality
    if (!enableUtilitiesIncluded) {
      setValue("utilities", undefined)
    }
  }, [enableUtilitiesIncluded, setValue])

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={t("listings.sections.additionalFees")}
        subheading={t("listings.sections.additionalFeesSubtitle")}
      >
        <Grid.Row>
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
        </Grid.Row>
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
                type={"currency"}
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
                  type={"currency"}
                  prepend={"$"}
                  register={register}
                  {...defaultFieldProps(
                    "depositRangeMin",
                    t("listings.depositMin"),
                    props.requiredFields,
                    errors,
                    clearErrors
                  )}
                />
              </Grid.Cell>
              <Grid.Cell>
                <Field
                  type={"currency"}
                  prepend={"$"}
                  register={register}
                  {...defaultFieldProps(
                    "depositRangeMax",
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
