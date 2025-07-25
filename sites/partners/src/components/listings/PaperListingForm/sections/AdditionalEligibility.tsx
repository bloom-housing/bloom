import React, { useEffect, useState, useContext } from "react"
import { useFormContext } from "react-hook-form"
import { Grid } from "@bloom-housing/ui-seeds"
import { t, Textarea } from "@bloom-housing/ui-components"
import { defaultFieldProps } from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { Jurisdiction } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AuthContext } from "@bloom-housing/shared-helpers"

type AdditionalEligibilityProps = {
  defaultText?: string
  requiredFields: string[]
}

const AdditionalEligibility = (props: AdditionalEligibilityProps) => {
  const formMethods = useFormContext()
  const [currentJurisdiction, setCurrentJurisdiction] = useState<Jurisdiction>()
  const { jurisdictionsService } = useContext(AuthContext)
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, clearErrors, watch, setValue, getValues } = formMethods

  const jurisdiction: string = watch("jurisdictions.id")
  const currentValue = getValues().rentalAssistance

  useEffect(() => {
    // Retrieve the jurisdiction data from the backend whenever the jurisdiction changes
    async function fetchData() {
      if (jurisdiction) {
        const jurisdictionData = await jurisdictionsService.retrieve({
          jurisdictionId: jurisdiction,
        })
        if (jurisdictionData) {
          setCurrentJurisdiction(jurisdictionData)
        }
      }
    }
    void fetchData()
  }, [jurisdiction, jurisdictionsService])

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
              defaultValue={
                jurisdiction && currentJurisdiction
                  ? currentJurisdiction?.rentalAssistanceDefault
                  : null
              }
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
