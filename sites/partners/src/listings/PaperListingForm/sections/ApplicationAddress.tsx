import React from "react"
import { useFormContext } from "react-hook-form"
import {
  t,
  GridSection,
  Textarea,
  Field,
  GridCell,
  Select,
  stateKeys,
  ViewItem,
  DateField,
  FieldGroup,
} from "@bloom-housing/ui-components"
import { YesNoAnswer } from "../../../applications/PaperApplicationForm/FormTypes"
import { FormListing } from "../index"

type ApplicationAddressProps = {
  listing?: FormListing
}

const ApplicationAddress = ({ listing }: ApplicationAddressProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = formMethods
  const postmarksConsidered: YesNoAnswer = watch("arePostmarksConsidered")
  const applicationsPickedUp: YesNoAnswer = watch("canPaperApplicationsBePickedUp")
  const applicationsDroppedOff: YesNoAnswer = watch("canApplicationsBeDroppedOff")
  const applicationsPickedUpAddress = watch("whereApplicationsPickedUp")
  const paperMailedToAnotherAddress = watch("arePaperAppsMailedToAnotherAddress")
  const droppedOffAddress = watch("whereApplicationsDroppedOff")

  const yesNoRadioOptions = [
    {
      label: t("t.yes"),
      value: YesNoAnswer.Yes,
    },
    {
      label: t("t.no"),
      value: YesNoAnswer.No,
    },
  ]

  // Only show mailing address as an option if they have indicated a mailing address exists
  const getLocationOptions = (prefix: string) => {
    const locationRadioOptions = [
      {
        label: t("listings.atLeasingAgentAddress"),
        value: "leasingAgent",
      },
      {
        label: t("listings.atAnotherAddress"),
        value: "anotherAddress",
      },
    ]
    if (paperMailedToAnotherAddress) {
      locationRadioOptions.splice(1, 0, {
        label: t("listings.atMailingAddress"),
        value: "mailingAddress",
      })
    }
    return locationRadioOptions.map((option) => {
      const optionID = `${prefix}${option.value[0].toUpperCase() + option.value.slice(1)}`
      return { ...option, id: optionID }
    })
  }

  return (
    <div>
      <hr className="mt-6 mb-6" />
      <span className="form-section__title">{t("listings.sections.applicationAddressTitle")}</span>
      <span className="form-section__description">
        {t("listings.sections.applicationAddressSubtitle")}
      </span>
      <GridSection grid={false} subtitle={t("listings.leasingAgentAddress")}>
        <GridSection columns={3}>
          <Field
            label={t("listings.streetAddressOrPOBox")}
            name={"leasingAgentAddress.street"}
            id={"leasingAgentAddress.street"}
            register={register}
            placeholder={t("application.contact.streetAddress")}
          />
          <Field
            label={t("application.contact.apt")}
            name={"leasingAgentAddress.street2"}
            id={"leasingAgentAddress.street2"}
            register={register}
            placeholder={t("application.contact.apt")}
          />
        </GridSection>
        <GridSection columns={6}>
          <GridCell span={2}>
            <Field
              label={t("application.contact.city")}
              name={"leasingAgentAddress.city"}
              id={"leasingAgentAddress.city"}
              register={register}
              placeholder={t("application.contact.city")}
            />
          </GridCell>
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
              errorMessage={t("errors.stateError")}
            />
          </ViewItem>
          <Field
            label={t("application.contact.zip")}
            name={"leasingAgentAddress.zipCode"}
            id={"leasingAgentAddress.zipCode"}
            placeholder={t("application.contact.zip")}
            errorMessage={t("errors.zipCodeError")}
            register={register}
          />
        </GridSection>
        <GridSection columns={1}>
          <Field
            id="arePaperAppsMailedToAnotherAddress"
            name="arePaperAppsMailedToAnotherAddress"
            type="checkbox"
            label={t("listings.paperDifferentAddress")}
            register={register}
            defaultValue={listing?.applicationMailingAddress}
          />
        </GridSection>
        {paperMailedToAnotherAddress && (
          <GridSection grid={false} subtitle={t("application.contact.mailingAddress")}>
            <GridSection columns={3}>
              <Field
                label={t("listings.streetAddressOrPOBox")}
                name={"applicationMailingAddress.street"}
                id={"applicationMailingAddress.street"}
                register={register}
                placeholder={t("application.contact.streetAddress")}
              />
              <Field
                label={t("application.contact.apt")}
                name={"applicationMailingAddress.street2"}
                id={"applicationMailingAddress.street2"}
                register={register}
                placeholder={t("application.contact.apt")}
              />
            </GridSection>
            <GridSection columns={6}>
              <GridCell span={2}>
                <Field
                  label={t("application.contact.city")}
                  name={"applicationMailingAddress.city"}
                  id={"applicationMailingAddress.city"}
                  register={register}
                  placeholder={t("application.contact.city")}
                />
              </GridCell>
              <ViewItem label={t("application.contact.state")} className="mb-0">
                <Select
                  id={`applicationMailingAddress.state`}
                  name={`applicationMailingAddress.state`}
                  label={t("application.contact.state")}
                  labelClassName="sr-only"
                  register={register}
                  controlClassName="control"
                  options={stateKeys}
                  keyPrefix="states"
                  errorMessage={t("errors.stateError")}
                />
              </ViewItem>
              <Field
                label={t("application.contact.zip")}
                name={"applicationMailingAddress.zipCode"}
                id={"applicationMailingAddress.zipCode"}
                placeholder={t("application.contact.zip")}
                errorMessage={t("errors.zipCodeError")}
                register={register}
              />
            </GridSection>
          </GridSection>
        )}
        <hr className="mt-6 mb-6" />
        <GridSection columns={8} className={"flex items-center"}>
          <GridCell span={2}>
            <p className="field-label m-4 ml-0">{t("listings.applicationPickupQuestion")}</p>
          </GridCell>
          <FieldGroup
            name="canPaperApplicationsBePickedUp"
            type="radio"
            register={register}
            fields={[
              { ...yesNoRadioOptions[0], id: "applicationsPickedUpYes" },
              { ...yesNoRadioOptions[1], id: "applicationsPickedUpNo" },
            ]}
          />
        </GridSection>
        {applicationsPickedUp === YesNoAnswer.Yes && (
          <GridSection columns={4}>
            <p className="field-label m-4 ml-0">{t("listings.wherePickupQuestion")}</p>
            <FieldGroup
              name="whereApplicationsPickedUp"
              type="radio"
              register={register}
              fields={getLocationOptions("pickUp")}
            />
          </GridSection>
        )}
        {applicationsPickedUpAddress === "anotherAddress" && (
          <GridSection grid={false} subtitle={t("listings.pickupAddress")}>
            <GridSection columns={3}>
              <Field
                label={t("listings.streetAddressOrPOBox")}
                name={"applicationPickUpAddress.street"}
                id={"applicationPickUpAddress.street"}
                register={register}
                placeholder={t("application.contact.streetAddress")}
              />
              <Field
                label={t("application.contact.apt")}
                name={"applicationPickUpAddress.street2"}
                id={"applicationPickUpAddress.street2"}
                register={register}
                placeholder={t("application.contact.apt")}
              />
            </GridSection>
            <GridSection columns={6}>
              <GridCell span={2}>
                <Field
                  label={t("application.contact.city")}
                  name={"applicationPickUpAddress.city"}
                  id={"applicationPickUpAddress.city"}
                  register={register}
                  placeholder={t("application.contact.city")}
                />
              </GridCell>
              <ViewItem label={t("application.contact.state")} className="mb-0">
                <Select
                  id={`applicationPickUpAddress.state`}
                  name={`applicationPickUpAddress.state`}
                  label={t("application.contact.state")}
                  labelClassName="sr-only"
                  register={register}
                  controlClassName="control"
                  options={stateKeys}
                  keyPrefix="states"
                  errorMessage={t("errors.stateError")}
                />
              </ViewItem>
              <Field
                label={t("application.contact.zip")}
                name={"applicationPickUpAddress.zipCode"}
                id={"applicationPickUpAddress.zipCode"}
                placeholder={t("application.contact.zip")}
                errorMessage={t("errors.zipCodeError")}
                register={register}
              />
            </GridSection>
            <GridSection columns={3}>
              <GridCell span={2}>
                <Textarea
                  label={t("leasingAgent.officeHours")}
                  name={"applicationPickUpAddressOfficeHours"}
                  id={"applicationPickUpAddressOfficeHours"}
                  fullWidth={true}
                  register={register}
                  placeholder={t("leasingAgent.officeHoursPlaceholder")}
                />
              </GridCell>
            </GridSection>
          </GridSection>
        )}
        <hr className="mt-6 mb-6" />
        <GridSection columns={8} className={"flex items-center"}>
          <GridCell span={2}>
            <p className="field-label m-4 ml-0">{t("listings.applicationDropOffQuestion")}</p>
          </GridCell>
          <FieldGroup
            name="canApplicationsBeDroppedOff"
            type="radio"
            register={register}
            fields={[
              { ...yesNoRadioOptions[0], id: "applicationsDroppedOffYes" },
              { ...yesNoRadioOptions[1], id: "applicationsDroppedOffNo" },
            ]}
          />
        </GridSection>
        {applicationsDroppedOff === YesNoAnswer.Yes && (
          <GridSection columns={4}>
            <p className="field-label m-4 ml-0">{t("listings.whereDropOffQuestion")}</p>
            <FieldGroup
              name="whereApplicationsDroppedOff"
              type="radio"
              register={register}
              fields={getLocationOptions("dropOff")}
            />
          </GridSection>
        )}
        {droppedOffAddress === "anotherAddress" && (
          <GridSection grid={false} subtitle={t("listings.dropOffAddress")}>
            <GridSection columns={3}>
              <Field
                label={t("listings.streetAddressOrPOBox")}
                name={"applicationDropOffAddress.street"}
                id={"applicationDropOffAddress.street"}
                register={register}
                placeholder={t("application.contact.streetAddress")}
              />
              <Field
                label={t("application.contact.apt")}
                name={"applicationDropOffAddress.street2"}
                id={"applicationDropOffAddress.street2"}
                register={register}
                placeholder={t("application.contact.apt")}
              />
            </GridSection>
            <GridSection columns={6}>
              <GridCell span={2}>
                <Field
                  label={t("application.contact.city")}
                  name={"applicationDropOffAddress.city"}
                  id={"applicationDropOffAddress.city"}
                  register={register}
                  placeholder={t("application.contact.city")}
                />
              </GridCell>
              <ViewItem label={t("application.contact.state")} className="mb-0">
                <Select
                  id={`applicationDropOffAddress.state`}
                  name={`applicationDropOffAddress.state`}
                  label={t("application.contact.state")}
                  labelClassName="sr-only"
                  register={register}
                  controlClassName="control"
                  options={stateKeys}
                  keyPrefix="states"
                  errorMessage={t("errors.stateError")}
                />
              </ViewItem>
              <Field
                label={t("application.contact.zip")}
                name={"applicationDropOffAddress.zipCode"}
                id={"applicationDropOffAddress.zipCode"}
                placeholder={t("application.contact.zip")}
                errorMessage={t("errors.zipCodeError")}
                register={register}
              />
            </GridSection>
            <GridSection columns={3}>
              <GridCell span={2}>
                <Textarea
                  label={t("leasingAgent.officeHours")}
                  name={"applicationDropOffAddressOfficeHours"}
                  id={"applicationDropOffAddressOfficeHours"}
                  fullWidth={true}
                  register={register}
                  placeholder={t("leasingAgent.officeHoursPlaceholder")}
                />
              </GridCell>
            </GridSection>
          </GridSection>
        )}
        <hr className="mt-6 mb-6" />

        <GridSection columns={8} className={"flex items-center"}>
          <GridCell span={2}>
            <p className="field-label m-4 ml-0">{t("listings.postmarksConsideredQuestion")}</p>
          </GridCell>
          <FieldGroup
            name="arePostmarksConsidered"
            type="radio"
            register={register}
            fields={[
              { ...yesNoRadioOptions[0], id: "postmarksConsideredYes" },
              { ...yesNoRadioOptions[1], id: "postmarksConsideredNo" },
            ]}
          />
        </GridSection>
        {postmarksConsidered === YesNoAnswer.Yes && (
          <GridSection columns={4}>
            <GridCell span={2}>
              <ViewItem label={t("listings.postmarkByDate")} className="mb-0">
                <DateField
                  label={""}
                  name={"postmarkedApplicationsReceivedByDate"}
                  id={"postmarkedApplicationsReceivedByDate"}
                  register={register}
                  watch={watch}
                />
              </ViewItem>
            </GridCell>
          </GridSection>
        )}
        <hr className="mt-6 mb-6" />
        {/* This is not currently shown on any listing?
        <GridSection columns={3}>
          <GridCell span={2}>
            <Textarea
              label={t("listings.additionalApplicationSubmissionNotes")}
              name={"additionalApplicationSubmissionNotes"}
              id={"additionalApplicationSubmissionNotes"}
              fullWidth={true}
              register={register}
              placeholder={t("t.addNotes")}
            />
          </GridCell>
        </GridSection> */}
      </GridSection>
    </div>
  )
}

export default ApplicationAddress
