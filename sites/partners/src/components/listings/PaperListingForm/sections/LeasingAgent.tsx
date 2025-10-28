import React, { useEffect, useState, useContext } from "react"
import { useFormContext } from "react-hook-form"
import { t, Textarea, Field, PhoneField, Select } from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import { stateKeys, AuthContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  fieldMessage,
  defaultFieldProps,
  getLabel,
  fieldIsRequired,
  getAddressErrorMessage,
} from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type LeasingAgentProps = {
  requiredFields: string[]
}

const LeasingAgent = (props: LeasingAgentProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, control, errors, clearErrors, watch, getValues } = formMethods
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const leasingAgentPhoneField: string = watch("leasingAgentPhone")
  const jurisdiction = watch("jurisdictions.id")

  const enableCompanyWebsite = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableCompanyWebsite,
    jurisdiction
  )
  const [phoneField, setPhoneField] = useState(leasingAgentPhoneField)

  useEffect(() => {
    // only clear the leasingAgentPhone if the user has changed the field
    if (leasingAgentPhoneField && leasingAgentPhoneField !== phoneField) {
      clearErrors("leasingAgentPhone")
    }
    setPhoneField(leasingAgentPhoneField)
  }, [leasingAgentPhoneField, clearErrors, phoneField])

  const getError = (subfield: string) => {
    return getAddressErrorMessage(
      `listingsLeasingAgentAddress.${subfield}`,
      "listingsLeasingAgentAddress",
      fieldMessage(
        errors?.listingsLeasingAgentAddress ? errors?.listingsLeasingAgentAddress[subfield] : null
      ),
      errors,
      getValues
    )
  }

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={t("listings.sections.leasingAgentTitle")}
        subheading={t("listings.sections.leasingAgentSubtitle")}
      >
        <Grid.Row columns={3}>
          <Grid.Cell>
            <Field
              register={register}
              {...defaultFieldProps(
                "leasingAgentName",
                t("leasingAgent.name"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Field
              register={register}
              inputProps={{
                onChange: () => clearErrors("leasingAgentEmail"),
              }}
              {...defaultFieldProps(
                "leasingAgentEmail",
                t("t.email"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
          <Grid.Cell>
            <PhoneField
              control={control}
              controlClassName={"control"}
              {...defaultFieldProps(
                "leasingAgentPhone",
                t("t.phone"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row columns={3}>
          <Grid.Cell>
            <Field
              register={register}
              {...defaultFieldProps(
                "leasingAgentTitle",
                t("leasingAgent.title"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
            {enableCompanyWebsite && (
              <Field
                register={register}
                {...defaultFieldProps(
                  "managementWebsite",
                  t("leasingAgent.managementWebsite"),
                  props.requiredFields,
                  errors,
                  clearErrors
                )}
              />
            )}
          </Grid.Cell>
          <Grid.Cell className="seeds-grid-span-2">
            <Textarea
              fullWidth={true}
              placeholder={""}
              note={t("leasingAgent.officeHoursPlaceholder")}
              register={register}
              {...defaultFieldProps(
                "leasingAgentOfficeHours",
                t("leasingAgent.officeHours"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
        </Grid.Row>
        <SectionWithGrid.HeadingRow>Leasing Agent Address</SectionWithGrid.HeadingRow>
        <Grid.Row columns={3}>
          <Grid.Cell className="seeds-grid-span-2">
            <Field
              label={getLabel(
                "listingsLeasingAgentAddress",
                props.requiredFields,
                t("listings.streetAddressOrPOBox")
              )}
              name={"listingsLeasingAgentAddress.street"}
              id={"listingsLeasingAgentAddress.street"}
              register={register}
              errorMessage={getError("street")}
              error={!!getError("street")}
              inputProps={{
                onChange: () => clearErrors("listingsLeasingAgentAddress"),
                "aria-required": fieldIsRequired(
                  "listingsLeasingAgentAddress",
                  props.requiredFields
                ),
              }}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Field
              label={t("application.contact.apt")}
              name={"listingsLeasingAgentAddress.street2"}
              id={"listingsLeasingAgentAddress.street2"}
              register={register}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row columns={7}>
          <Grid.Cell className="seeds-grid-span-3">
            <Field
              label={getLabel(
                "listingsLeasingAgentAddress",
                props.requiredFields,
                t("application.contact.city")
              )}
              name={"listingsLeasingAgentAddress.city"}
              id={"listingsLeasingAgentAddress.city"}
              register={register}
              errorMessage={getError("city")}
              error={!!getError("city")}
              inputProps={{
                onChange: () => clearErrors("listingsLeasingAgentAddress"),
                "aria-required": fieldIsRequired(
                  "listingsLeasingAgentAddress",
                  props.requiredFields
                ),
              }}
            />
          </Grid.Cell>

          <Grid.Cell className="seeds-grid-span-2">
            <Select
              id={`listingsLeasingAgentAddress.state`}
              name={`listingsLeasingAgentAddress.state`}
              label={getLabel(
                "listingsLeasingAgentAddress",
                props.requiredFields,
                t("application.contact.state")
              )}
              register={register}
              controlClassName="control"
              options={stateKeys}
              keyPrefix="states"
              errorMessage={getError("state")}
              error={!!getError("state")}
              inputProps={{
                onChange: () => clearErrors("listingsLeasingAgentAddress"),
                "aria-required": fieldIsRequired(
                  "listingsLeasingAgentAddress",
                  props.requiredFields
                ),
              }}
            />
          </Grid.Cell>

          <Grid.Cell className="seeds-grid-span-2">
            <Field
              label={getLabel(
                "listingsLeasingAgentAddress",
                props.requiredFields,
                t("application.contact.zip")
              )}
              name={"listingsLeasingAgentAddress.zipCode"}
              id={"listingsLeasingAgentAddress.zipCode"}
              errorMessage={getError("zipCode")}
              error={!!getError("zipCode")}
              register={register}
              inputProps={{
                onChange: () => clearErrors("listingsLeasingAgentAddress"),
                "aria-required": fieldIsRequired(
                  "listingsLeasingAgentAddress",
                  props.requiredFields
                ),
              }}
            />
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export default LeasingAgent
