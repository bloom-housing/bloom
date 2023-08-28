import React from "react"
import { useFormContext } from "react-hook-form"
import { t, Field, SelectOption, Select } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { fieldMessage, fieldHasError } from "../../../../lib/helpers"
import { Jurisdiction } from "@bloom-housing/backend-core/types"
import SectionWithGrid from "../../../shared/SectionWithGrid"

interface ListingIntroProps {
  jurisdictions: Jurisdiction[]
}
const ListingIntro = (props: ListingIntroProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, clearErrors, errors } = formMethods

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
        <Grid.Row columns={3} className={`${defaultJurisdiction ? "hidden" : ""}`}>
          <FieldValue
            label={t("t.jurisdiction")}
            className={`grid-double-span ${
              fieldHasError(errors?.jurisdiction) || fieldHasError(errors?.["jurisdiction.id"])
                ? "field-value-error"
                : ""
            }`}
          >
            <Select
              id={"jurisdiction.id"}
              defaultValue={defaultJurisdiction}
              name={"jurisdiction.id"}
              label={t("t.jurisdiction")}
              labelClassName="sr-only"
              register={register}
              controlClassName={`control ${defaultJurisdiction ? "hidden" : ""}`}
              error={
                fieldHasError(errors?.jurisdiction) || fieldHasError(errors?.["jurisdiction.id"])
              }
              subNote={t("listings.requiredToPublish")}
              errorMessage={
                fieldMessage(errors?.jurisdiction) ??
                fieldMessage(errors?.["jurisdiction.id"]) ??
                undefined
              }
              keyPrefix={"jurisdictions"}
              options={jurisdictionOptions}
              inputProps={{
                onChange: () => {
                  console.log("jurisdiction change")
                  ;(fieldHasError(errors?.jurisdiction) ||
                    fieldHasError(errors?.["jurisdiction.id"])) &&
                    clearErrors("jurisdiction")
                },
              }}
            />
          </FieldValue>
        </Grid.Row>
        <Grid.Row columns={3}>
          <Grid.Cell>
            <Field
              id="name"
              name="name"
              label={t("listings.listingName")}
              placeholder={t("listings.listingName")}
              inputProps={{
                onChange: () => {
                  fieldHasError(errors?.name) && clearErrors("name")
                },
              }}
              subNote={t("listings.requiredToPublish")}
              register={register}
              error={fieldHasError(errors?.name)}
              errorMessage={fieldMessage(errors?.name)}
              dataTestId={"nameField"}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Field
              id="developer"
              name="developer"
              label={t("listings.developer")}
              placeholder={t("listings.developer")}
              subNote={t("listings.requiredToPublish")}
              error={fieldHasError(errors?.developer)}
              errorMessage={fieldMessage(errors?.developer)}
              inputProps={{
                onChange: () => fieldHasError(errors?.developer) && clearErrors("developer"),
              }}
              register={register}
            />
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export default ListingIntro
