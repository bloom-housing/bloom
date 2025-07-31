import React from "react"
import { useFormContext } from "react-hook-form"
import { Jurisdiction } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t, Field, SelectOption, Select } from "@bloom-housing/ui-components"
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
      </SectionWithGrid>
    </>
  )
}

export default ListingIntro
