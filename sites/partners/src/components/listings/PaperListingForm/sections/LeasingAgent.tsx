import React, { useEffect, useState, useContext } from "react"
import { useFormContext } from "react-hook-form"
import { t, Textarea, Field, PhoneField, Select } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { stateKeys, AuthContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { fieldMessage, fieldHasError } from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const LeasingAgent = () => {
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
              label={t("leasingAgent.name")}
              name={"leasingAgentName"}
              id={"leasingAgentName"}
              subNote={t("listings.requiredToPublish")}
              error={fieldHasError(errors?.leasingAgentName)}
              errorMessage={fieldMessage(errors?.leasingAgentName)}
              placeholder={t("leasingAgent.namePlaceholder")}
              register={register}
              inputProps={{
                onChange: () => clearErrors("leasingAgentName"),
              }}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Field
              label={t("t.email")}
              name={"leasingAgentEmail"}
              id={"leasingAgentEmail"}
              subNote={t("listings.requiredToPublish")}
              error={fieldHasError(errors?.leasingAgentEmail)}
              errorMessage={fieldMessage(errors?.leasingAgentEmail)}
              placeholder={t("t.emailAddressPlaceholder")}
              register={register}
              inputProps={{
                onChange: () => clearErrors("leasingAgentEmail"),
              }}
            />
          </Grid.Cell>
          <Grid.Cell>
            <PhoneField
              label={t("t.phone")}
              name={"leasingAgentPhone"}
              id={"leasingAgentPhone"}
              subNote={t("listings.requiredToPublish")}
              error={fieldHasError(errors?.leasingAgentPhone)}
              errorMessage={fieldMessage(errors?.leasingAgentPhone)}
              placeholder={t("t.phoneNumberPlaceholder")}
              control={control}
              controlClassName={"control"}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row columns={3}>
          <Grid.Cell>
            <Field
              label={t("leasingAgent.title")}
              name={"leasingAgentTitle"}
              id={"leasingAgentTitle"}
              placeholder={t("leasingAgent.title")}
              register={register}
            />
            {enableCompanyWebsite && (
              <Field
                label={t("leasingAgent.managementWebsite")}
                name={"managementWebsite"}
                id={"managementWebsite"}
                placeholder={t("leasingAgent.managementWebsitePlaceholder")}
                register={register}
                error={fieldHasError(errors?.managementWebsite)}
                errorMessage={fieldMessage(errors?.managementWebsite)}
                inputProps={{
                  onChange: () => clearErrors("managementWebsite"),
                }}
              />
            )}
          </Grid.Cell>
          <Grid.Cell className="seeds-grid-span-2">
            <Textarea
              label={t("leasingAgent.officeHours")}
              name={"leasingAgentOfficeHours"}
              id={"leasingAgentOfficeHours"}
              fullWidth={true}
              placeholder={t("leasingAgent.officeHoursPlaceholder")}
              register={register}
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
