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
import { FormListing, addressTypes } from "../index"
import moment from "moment"

type ApplicationAddressProps = {
  listing?: FormListing
}

const ApplicationAddress = ({ listing }: ApplicationAddressProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = formMethods
  const postmarksConsidered: YesNoAnswer = watch(
    "arePostmarksConsidered",
    listing && listing?.postmarkedApplicationsReceivedByDate !== null
      ? YesNoAnswer.Yes
      : YesNoAnswer.No
  )
  const applicationsPickedUp: YesNoAnswer = watch(
    "canPaperApplicationsBePickedUp",
    listing?.applicationPickUpAddress || listing?.applicationPickUpAddressType
      ? YesNoAnswer.Yes
      : YesNoAnswer.No
  )
  const applicationsDroppedOff: YesNoAnswer = watch(
    "canApplicationsBeDroppedOff",
    listing?.applicationDropOffAddress || listing?.applicationDropOffAddressType
      ? YesNoAnswer.Yes
      : YesNoAnswer.No
  )
  const applicationsPickedUpAddress = watch(
    "whereApplicationsPickedUp",
    listing?.applicationPickUpAddress || listing?.applicationPickUpAddressType
      ? listing?.applicationPickUpAddressType || addressTypes.anotherAddress
      : null
  )
  const paperMailedToAnotherAddress = watch(
    "arePaperAppsMailedToAnotherAddress",
    listing && listing?.applicationMailingAddress !== null
  )
  const droppedOffAddress = watch(
    "whereApplicationsDroppedOff",
    listing?.applicationDropOffAddress || listing?.applicationDropOffAddressType
      ? listing?.applicationDropOffAddressType || addressTypes.anotherAddress
      : null
  )

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
  const getLocationOptions = (
    prefix: string,
    addressType: string,
    anotherAddressExists: boolean
  ) => {
    const locationRadioOptions = [
      {
        label: t("listings.atLeasingAgentAddress"),
        defaultChecked: addressType === addressTypes.leasingAgent,
        value: addressTypes.leasingAgent,
      },
      {
        label: t("listings.atAnotherAddress"),
        defaultChecked: anotherAddressExists,
        value: addressTypes.anotherAddress,
      },
    ]
    if (paperMailedToAnotherAddress) {
      locationRadioOptions.splice(1, 0, {
        label: t("listings.atMailingAddress"),
        defaultChecked: addressType === addressTypes.mailingAddress,
        value: addressTypes.mailingAddress,
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
            inputProps={{
              defaultChecked: listing && listing?.applicationMailingAddress !== null,
            }}
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
              {
                ...yesNoRadioOptions[0],
                id: "applicationsPickedUpYes",
                defaultChecked:
                  listing?.applicationPickUpAddress || listing?.applicationPickUpAddressType,
              },
              {
                ...yesNoRadioOptions[1],
                id: "applicationsPickedUpNo",
                defaultChecked:
                  listing?.applicationPickUpAddress === null &&
                  listing?.applicationPickUpAddressType === null,
              },
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
              fields={getLocationOptions(
                "pickUp",
                listing?.applicationPickUpAddressType,
                listing?.applicationPickUpAddress
              )}
            />
          </GridSection>
        )}
        {applicationsPickedUp === YesNoAnswer.Yes &&
          applicationsPickedUpAddress === addressTypes.anotherAddress && (
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
              {
                ...yesNoRadioOptions[0],
                id: "applicationsDroppedOffYes",
                defaultChecked:
                  listing?.applicationDropOffAddress || listing?.applicationDropOffAddressType,
              },
              {
                ...yesNoRadioOptions[1],
                id: "applicationsDroppedOffNo",
                defaultChecked:
                  listing?.applicationDropOffAddress === null &&
                  listing?.applicationDropOffAddressType === null,
              },
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
              fields={getLocationOptions(
                "dropOff",
                listing?.applicationDropOffAddressType,
                listing?.applicationDropOffAddress
              )}
            />
          </GridSection>
        )}
        {applicationsDroppedOff === YesNoAnswer.Yes &&
          droppedOffAddress === addressTypes.anotherAddress && (
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
              {
                ...yesNoRadioOptions[0],
                id: "postmarksConsideredYes",
                defaultChecked: listing && listing.postmarkedApplicationsReceivedByDate !== null,
              },
              {
                ...yesNoRadioOptions[1],
                id: "postmarksConsideredNo",
                defaultChecked: listing && listing.postmarkedApplicationsReceivedByDate === null,
              },
            ]}
          />
        </GridSection>
        {postmarksConsidered === YesNoAnswer.Yes && (
          <GridSection columns={4}>
            <GridCell span={2}>
              <ViewItem label={t("listings.postmarkByDate")} className="mb-0">
                <DateField
                  label={""}
                  name={"postMarkDate"}
                  id={"postMarkDate"}
                  register={register}
                  watch={watch}
                  defaultDate={{
                    month:
                      moment(new Date(listing?.postmarkedApplicationsReceivedByDate))
                        .utc()
                        .format("MM") ?? null,
                    day:
                      moment(new Date(listing?.postmarkedApplicationsReceivedByDate))
                        .utc()
                        .format("DD") ?? null,
                    year:
                      moment(new Date(listing?.postmarkedApplicationsReceivedByDate))
                        .utc()
                        .format("YYYY") ?? null,
                  }}
                />
              </ViewItem>
            </GridCell>
          </GridSection>
        )}
        <hr className="mt-6 mb-6" />
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
        </GridSection>
      </GridSection>
    </div>
  )
}

export default ApplicationAddress
