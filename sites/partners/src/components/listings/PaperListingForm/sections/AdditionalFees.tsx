import React, { useContext, useMemo, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { t, Field, Textarea, FieldGroup } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { fieldHasError, fieldMessage } from "../../../../lib/helpers"
import { AuthContext, listingUtilities } from "@bloom-housing/shared-helpers"
import { ListingUtilities } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type AdditionalFeesProps = {
  existingUtilities: ListingUtilities
}

const AdditionalFees = (props: AdditionalFeesProps) => {
  const formMethods = useFormContext()
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors, clearErrors, setValue } = formMethods

  const jurisdiction = watch("jurisdictions.id")

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
    "enableUtilitiesIncluded",
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
              label={t("listings.applicationFee")}
              name={"applicationFee"}
              id={"applicationFee"}
              register={register}
              type={"currency"}
              prepend={"$"}
              placeholder={"0.00"}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Field
              label={t("listings.depositMin")}
              name={"depositMin"}
              id={"depositMin"}
              register={register}
              type={"currency"}
              prepend={"$"}
              placeholder={"0.00"}
              error={fieldHasError(errors?.depositMin)}
              errorMessage={fieldMessage(errors?.depositMin)}
              inputProps={{
                onChange: () => clearErrors("depositMin"),
              }}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Field
              label={t("listings.depositMax")}
              name={"depositMax"}
              id={"depositMax"}
              register={register}
              type={"currency"}
              prepend={"$"}
              placeholder={"0.00"}
              error={fieldHasError(errors?.depositMax)}
              errorMessage={fieldMessage(errors?.depositMax?.message)}
              inputProps={{
                onChange: () => clearErrors("depositMax"),
              }}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row>
          <Grid.Cell>
            <Textarea
              label={t("listings.sections.depositHelperText")}
              name={"depositHelperText"}
              id={"depositHelperText"}
              aria-describedby={"depositHelperText"}
              fullWidth={true}
              register={register}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Textarea
              label={t("listings.sections.costsNotIncluded")}
              name={"costsNotIncluded"}
              id={"costsNotIncluded"}
              aria-describedby={"costsNotIncluded"}
              fullWidth={true}
              register={register}
            />
          </Grid.Cell>
        </Grid.Row>
        {enableUtilitiesIncluded && (
          <Grid.Row>
            <FieldValue label={t("listings.sections.utilities")}>
              <FieldGroup
                type="checkbox"
                name="utilities"
                fields={utilitiesFields}
                register={register}
                fieldGroupClassName="grid grid-cols-2 mt-4"
              />
            </FieldValue>
          </Grid.Row>
        )}
      </SectionWithGrid>
    </>
  )
}

export default AdditionalFees
