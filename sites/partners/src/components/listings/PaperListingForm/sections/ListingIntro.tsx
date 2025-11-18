import React from "react"
import { useFormContext } from "react-hook-form"
import { t, Field } from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import { defaultFieldProps } from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

interface ListingIntroProps {
  enableHousingDeveloperOwner: boolean
  enableListingFileNumber: boolean
  jurisdictionName: string
  listingId: string
  requiredFields: string[]
}

const getDeveloperLabel = (enableHousingDeveloperOwner: boolean) => {
  return enableHousingDeveloperOwner ? t("listings.housingDeveloperOwner") : t("listings.developer")
}

const ListingIntro = (props: ListingIntroProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, clearErrors, errors } = formMethods

  return (
    <>
      {(props.listingId || props.jurisdictionName) && (
        <hr className="spacer-section-above spacer-section" />
      )}
      <SectionWithGrid
        heading={t("listings.sections.introTitle")}
        subheading={t("listings.sections.introSubtitle")}
      >
        {props.enableListingFileNumber && (
          <Grid.Row columns={2}>
            <Grid.Cell>
              <Field
                register={register}
                {...defaultFieldProps(
                  "listingFileNumber",
                  t("listings.listingFileNumber"),
                  props.requiredFields,
                  errors,
                  clearErrors
                )}
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
          <Grid.Cell>
            <Field
              register={register}
              {...defaultFieldProps(
                "developer",
                getDeveloperLabel(props.enableHousingDeveloperOwner),
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

export default ListingIntro
