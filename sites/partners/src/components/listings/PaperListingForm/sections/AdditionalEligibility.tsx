import React, { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { Grid } from "@bloom-housing/ui-seeds"
import { t, Textarea } from "@bloom-housing/ui-components"
import { fieldHasError, fieldMessage } from "../../../../lib/helpers"
import { useJurisdiction } from "../../../../lib/hooks"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type AdditionalEligibilityProps = {
  defaultText?: string
}

const AdditionalEligibility = (props: AdditionalEligibilityProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, clearErrors, watch, setValue, getValues } = formMethods

  const jurisdiction: string = watch("jurisdiction.id")
  const currentValue = getValues().rentalAssistance

  const { data: currentJurisdiction = undefined } = useJurisdiction(jurisdiction)

  useEffect(() => {
    if (currentJurisdiction && !currentValue) {
      setValue(
        "rentalAssistance",
        props.defaultText ?? (currentJurisdiction && currentJurisdiction?.rentalAssistanceDefault)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentJurisdiction, setValue])

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={t("listings.sections.additionalEligibilityTitle")}
        subheading={t("listings.sections.additionalEligibilitySubtext")}
      >
        <Grid.Row columns={2}>
          <Grid.Cell>
            <Textarea
              label={t("listings.creditHistory")}
              name={"creditHistory"}
              id={"creditHistory"}
              fullWidth={true}
              register={register}
              maxLength={2000}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Textarea
              label={t("listings.rentalHistory")}
              name={"rentalHistory"}
              id={"rentalHistory"}
              fullWidth={true}
              register={register}
              maxLength={2000}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Cell>
            <Textarea
              label={t("listings.criminalBackground")}
              name={"criminalBackground"}
              id={"criminalBackground"}
              fullWidth={true}
              register={register}
              maxLength={2000}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Textarea
              label={t("listings.sections.rentalAssistanceTitle")}
              name={"rentalAssistance"}
              id={"rentalAssistance"}
              fullWidth={true}
              register={register}
              defaultValue={
                jurisdiction && currentJurisdiction
                  ? currentJurisdiction?.rentalAssistanceDefault
                  : null
              }
              errorMessage={fieldMessage(errors?.rentalAssistance)}
              inputProps={{
                onChange: () =>
                  fieldHasError(errors?.rentalAssistance) && clearErrors("rentalAssistance"),
              }}
            />
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export default AdditionalEligibility
