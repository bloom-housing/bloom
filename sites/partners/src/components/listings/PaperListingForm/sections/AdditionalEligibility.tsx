import React, { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { Grid } from "@bloom-housing/ui-seeds"
import { t, Textarea } from "@bloom-housing/ui-components"
import { defaultFieldProps } from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type AdditionalEligibilityProps = {
  defaultText: string | null
  jurisdiction: string
  requiredFields: string[]
}

const AdditionalEligibility = (props: AdditionalEligibilityProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, clearErrors, setValue, getValues } = formMethods

  const currentValue = getValues().rentalAssistance

  useEffect(() => {
    if (!currentValue) {
      setValue("rentalAssistance", props.defaultText)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
              fullWidth={true}
              register={register}
              maxLength={2000}
              placeholder={""}
              {...defaultFieldProps(
                "creditHistory",
                t("listings.creditHistory"),
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
              maxLength={2000}
              placeholder={""}
              {...defaultFieldProps(
                "rentalHistory",
                t("listings.rentalHistory"),
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
              maxLength={2000}
              placeholder={""}
              {...defaultFieldProps(
                "criminalBackground",
                t("listings.criminalBackground"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Textarea
              placeholder={""}
              fullWidth={true}
              register={register}
              defaultValue={props.defaultText}
              {...defaultFieldProps(
                "rentalAssistance",
                t("listings.sections.rentalAssistanceTitle"),
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

export default AdditionalEligibility
