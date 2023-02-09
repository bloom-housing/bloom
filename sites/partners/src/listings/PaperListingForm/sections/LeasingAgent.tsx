import React, { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { isURL } from "class-validator"
import {
  t,
  GridSection,
  Textarea,
  Field,
  PhoneField,
  GridCell,
  Select,
} from "@bloom-housing/ui-components"
import { ViewItem } from "../../../../../../detroit-ui-components/src/blocks/ViewItem"
import { fieldMessage, fieldHasError } from "../../../../lib/helpers"
import { stateKeys } from "@bloom-housing/shared-helpers"

const LeasingAgent = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, control, errors, clearErrors, watch, trigger, getValues } = formMethods

  const leasingAgentPhoneField: string = watch("leasingAgentPhone")

  const getErrorMessage = (fieldKey: string) => {
    if (fieldHasError(errors?.leasingAgentAddress) && !getValues(fieldKey)) {
      return t("errors.partialAddress")
    }
  }

  useEffect(() => {
    clearErrors("leasingAgentPhone")
  }, [leasingAgentPhoneField, clearErrors])

  return (
    <div>
      <GridSection
        grid={false}
        separator
        title={t("listings.sections.leasingAgentTitle")}
        description={t("listings.sections.leasingAgentSubtitle")}
      >
        <GridSection columns={3}>
          <Field
            label={t("leasingAgent.name")}
            name={"leasingAgentName"}
            id={"leasingAgentName"}
            error={fieldHasError(errors?.leasingAgentName)}
            errorMessage={fieldMessage(errors?.leasingAgentName)}
            placeholder={t("leasingAgent.namePlaceholder")}
            register={register}
            inputProps={{
              onChange: () => clearErrors("leasingAgentName"),
            }}
            dataTestId="leasingAgentName"
          />
          <Field
            label={t("t.email")}
            name={"leasingAgentEmail"}
            id={"leasingAgentEmail"}
            error={fieldHasError(errors?.leasingAgentEmail)}
            errorMessage={fieldMessage(errors?.leasingAgentEmail)}
            placeholder={t("t.emailAddressPlaceholder")}
            register={register}
            inputProps={{
              onChange: () => clearErrors("leasingAgentEmail"),
            }}
            dataTestId="leasingAgentEmail"
          />
          <PhoneField
            label={t("t.phone")}
            name={"leasingAgentPhone"}
            id={"leasingAgentPhone"}
            error={fieldHasError(errors?.leasingAgentPhone)}
            errorMessage={fieldMessage(errors?.leasingAgentPhone)}
            placeholder={t("t.phoneNumberPlaceholder")}
            control={control}
            controlClassName={"control"}
            required={true}
            dataTestId="leasingAgentPhone"
          />
        </GridSection>
        <GridSection columns={2}>
          <GridSection columns={1}>
            <Field
              label={t("leasingAgent.title")}
              name={"leasingAgentTitle"}
              id={"leasingAgentTitle"}
              placeholder={t("leasingAgent.title")}
              register={register}
              dataTestId="leasingAgentTitle"
            />
            <Field
              label={t("leasingAgent.managementWebsite")}
              name={"managementWebsite"}
              id={"managementWebsite"}
              placeholder={t("leasingAgent.managementWebsitePlaceholder")}
              register={register}
              validation={{
                validate: (value) =>
                  isURL(value, { require_protocol: true }) || t("errors.urlError"),
              }}
              error={fieldHasError(errors?.managementWebsite)}
              errorMessage={t("errors.urlError")}
              type="url"
              onChange={(e) =>
                e.currentTarget.value
                  ? trigger("managementWebsite")
                  : clearErrors("managementWebsite")
              }
              dataTestId="managementWebsite"
            />
          </GridSection>
          <Textarea
            label={t("leasingAgent.officeHours")}
            name={"leasingAgentOfficeHours"}
            id={"leasingAgentOfficeHours"}
            fullWidth={true}
            placeholder={t("leasingAgent.officeHoursPlaceholder")}
            register={register}
            dataTestId="leasingAgentOfficeHours"
          />
        </GridSection>
        <GridSection columns={3} subtitle={"Leasing Agent Address"}>
          <GridCell span={2}>
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
              dataTestId="leasingAgentAddress.street"
            />
          </GridCell>
          <Field
            label={t("application.contact.apt")}
            name={"leasingAgentAddress.street2"}
            id={"leasingAgentAddress.street2"}
            register={register}
            placeholder={t("application.contact.apt")}
            dataTestId="leasingAgentAddress.street2"
          />
        </GridSection>
        <GridSection columns={7}>
          <GridCell span={3}>
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
              dataTestId="leasingAgentAddress.city"
            />
          </GridCell>
          <GridCell span={2}>
            <ViewItem label={t("application.contact.state")} className="mb-0">
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
                dataTestId="leasingAgentAddress.state"
              />
            </ViewItem>
          </GridCell>
          <GridCell span={2}>
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
              dataTestId="leasingAgentAddress.zipCode"
            />
          </GridCell>
        </GridSection>
      </GridSection>
    </div>
  )
}

export default LeasingAgent
