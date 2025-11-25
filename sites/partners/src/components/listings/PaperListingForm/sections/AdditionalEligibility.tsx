import React, { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { Grid } from "@bloom-housing/ui-seeds"
import { t, Textarea } from "@bloom-housing/ui-components"
import { defaultFieldProps } from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { FormListing } from "../../../../lib/listings/formTypes"

type AdditionalEligibilityProps = {
  defaultText: string | null
  listing: FormListing
  requiredFields: string[]
}

const AdditionalEligibility = (props: AdditionalEligibilityProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, clearErrors, setValue } = formMethods

  useEffect(() => {
    setValue("rentalAssistance", props.listing?.rentalAssistance || props.defaultText)
  }, [props.listing, props.defaultText, setValue])

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
              defaultValue={props.listing ? props.listing.rentalAssistance : props.defaultText}
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
