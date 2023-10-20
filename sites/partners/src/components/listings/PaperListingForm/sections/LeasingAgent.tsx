import React, { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { t, Textarea, Field, PhoneField, Select } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { stateKeys } from "@bloom-housing/shared-helpers"
import { fieldMessage, fieldHasError } from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const LeasingAgent = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, control, errors, clearErrors, watch, getValues } = formMethods

  const leasingAgentPhoneField: string = watch("leasingAgentPhone")
  const [phoneField, setPhoneField] = useState(leasingAgentPhoneField)

  const getErrorMessage = (fieldKey: string) => {
    if (fieldHasError(errors?.leasingAgentAddress) && !getValues(fieldKey)) {
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
              name={"leasingAgentAddress.street"}
              id={"leasingAgentAddress.street"}
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
              name={"leasingAgentAddress.street2"}
              id={"leasingAgentAddress.street2"}
              register={register}
              placeholder={t("application.contact.apt")}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row columns={7}>
          <Grid.Cell className="seeds-grid-span-3">
            <Field
              label={t("application.contact.city")}
              name={"leasingAgentAddress.city"}
              id={"leasingAgentAddress.city"}
              register={register}
              placeholder={t("application.contact.city")}
              errorMessage={getErrorMessage("leasingAgentAddress.city")}
              error={!!getErrorMessage("leasingAgentAddress.city")}
              inputProps={{
                onChange: () => clearErrors("leasingAgentAddress"),
              }}
            />
          </Grid.Cell>

          <FieldValue label={t("application.contact.state")} className="seeds-grid-span-2">
            <Select
              id={`leasingAgentAddress.state`}
              name={`leasingAgentAddress.state`}
              label={t("application.contact.state")}
              labelClassName="sr-only"
              register={register}
              controlClassName="control"
              options={stateKeys}
              keyPrefix="states"
              errorMessage={getErrorMessage("leasingAgentAddress.state")}
              error={!!getErrorMessage("leasingAgentAddress.state")}
              inputProps={{
                onChange: () => clearErrors("leasingAgentAddress"),
              }}
            />
          </FieldValue>

          <Grid.Cell className="seeds-grid-span-2">
            <Field
              label={t("application.contact.zip")}
              name={"leasingAgentAddress.zipCode"}
              id={"leasingAgentAddress.zipCode"}
              placeholder={t("application.contact.zip")}
              errorMessage={getErrorMessage("leasingAgentAddress.zipCode")}
              error={!!getErrorMessage("leasingAgentAddress.zipCode")}
              register={register}
              inputProps={{
                onChange: () => clearErrors("leasingAgentAddress"),
              }}
            />
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export default LeasingAgent
