import React, { useEffect, useState, useContext } from "react"
import { useFormContext } from "react-hook-form"
import { t, Textarea, Field, PhoneField, Select } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { stateKeys, AuthContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { fieldMessage, fieldHasError, defaultFieldProps } from "../../../../lib/helpers"
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

  const getErrorMessage = (fieldKey: string) => {
    if (fieldHasError(errors?.listingsLeasingAgentAddress) && !getValues(fieldKey)) {
      return t("errors.partialAddress")
    }
  }

  useEffect(() => {
    // only clear the leasingAgentPhone if the user has changed the field
    if (leasingAgentPhoneField && leasingAgentPhoneField !== phoneField) {
      clearErrors("leasingAgentPhone")
    }
    setPhoneField(leasingAgentPhoneField)
  }, [leasingAgentPhoneField, clearErrors, phoneField])

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
              label={t("listings.streetAddressOrPOBox")}
              name={"listingsLeasingAgentAddress.street"}
              id={"listingsLeasingAgentAddress.street"}
              register={register}
              placeholder={t("application.contact.streetAddress")}
              errorMessage={getErrorMessage("leasingAgentAddress.street")}
              error={!!getErrorMessage("leasingAgentAddress.street")}
              inputProps={{
                onChange: () => clearErrors("leasingAgentAddress"),
              }}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Field
              label={t("application.contact.apt")}
              name={"listingsLeasingAgentAddress.street2"}
              id={"listingsLeasingAgentAddress.street2"}
              register={register}
              placeholder={t("application.contact.apt")}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row columns={7}>
          <Grid.Cell className="seeds-grid-span-3">
            <Field
              label={t("application.contact.city")}
              name={"listingsLeasingAgentAddress.city"}
              id={"listingsLeasingAgentAddress.city"}
              register={register}
              placeholder={t("application.contact.city")}
              errorMessage={getErrorMessage("listingsLeasingAgentAddress.city")}
              error={!!getErrorMessage("listingsLeasingAgentAddress.city")}
              inputProps={{
                onChange: () => clearErrors("listingsLeasingAgentAddress"),
              }}
            />
          </Grid.Cell>

          <FieldValue label={t("application.contact.state")} className="seeds-grid-span-2">
            <Select
              id={`listingsLeasingAgentAddress.state`}
              name={`listingsLeasingAgentAddress.state`}
              label={t("application.contact.state")}
              labelClassName="sr-only"
              register={register}
              controlClassName="control"
              options={stateKeys}
              keyPrefix="states"
              errorMessage={getErrorMessage("listingsLeasingAgentAddress.state")}
              error={!!getErrorMessage("listingsLeasingAgentAddress.state")}
              inputProps={{
                onChange: () => clearErrors("listingsLeasingAgentAddress"),
              }}
            />
          </FieldValue>

          <Grid.Cell className="seeds-grid-span-2">
            <Field
              label={t("application.contact.zip")}
              name={"listingsLeasingAgentAddress.zipCode"}
              id={"listingsLeasingAgentAddress.zipCode"}
              placeholder={t("application.contact.zip")}
              errorMessage={getErrorMessage("listingsLeasingAgentAddress.zipCode")}
              error={!!getErrorMessage("listingsLeasingAgentAddress.zipCode")}
              register={register}
              inputProps={{
                onChange: () => clearErrors("listingsLeasingAgentAddress"),
              }}
            />
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export default LeasingAgent
