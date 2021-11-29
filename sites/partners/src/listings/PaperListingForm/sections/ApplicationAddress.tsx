import React from "react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  t,
  GridSection,
  Textarea,
  Field,
  GridCell,
  Select,
  ViewItem,
  DateField,
  FieldGroup,
  TimeField,
} from "@bloom-housing/ui-components"
import { stateKeys } from "@bloom-housing/shared-helpers"
import { YesNoAnswer } from "../../../applications/PaperApplicationForm/FormTypes"
import { FormListing, addressTypes } from "../index"
import moment from "moment"
import { isNullOrUndefined } from "../../../../lib/helpers"

type ApplicationAddressProps = {
  listing?: FormListing
}

const ApplicationAddress = ({ listing }: ApplicationAddressProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, control } = formMethods

  const postmarksConsidered: YesNoAnswer = useWatch({
    control,
    name: "arePostmarksConsidered",
    defaultValue:
      listing && listing?.postmarkedApplicationsReceivedByDate !== null
        ? YesNoAnswer.Yes
        : YesNoAnswer.No,
  })

  const applicationsPickedUp: YesNoAnswer = useWatch({
    control,
    name: "canPaperApplicationsBePickedUp",
    defaultValue:
      listing?.applicationPickUpAddress || listing?.applicationPickUpAddressType
        ? YesNoAnswer.Yes
        : YesNoAnswer.No,
  })

  const applicationsDroppedOff: YesNoAnswer = useWatch({
    control,
    name: "canApplicationsBeDroppedOff",
    defaultValue:
      listing?.applicationDropOffAddress || listing?.applicationDropOffAddressType
        ? YesNoAnswer.Yes
        : YesNoAnswer.No,
  })

  const pickedUpAddressType = useWatch({
    control,
    name: "whereApplicationsPickedUp",
    defaultValue: listing?.applicationPickUpAddressType
      ? listing?.applicationPickUpAddressType
      : listing?.applicationPickUpAddress
      ? addressTypes.anotherAddress
      : null,
  })

  const paperMailedToAnotherAddress = useWatch({
    control,
    name: "arePaperAppsMailedToAnotherAddress",
    defaultValue: listing && listing?.applicationMailingAddress !== null,
  })

  const droppedOffAddressType = useWatch({
    control,
    name: "whereApplicationsDroppedOff",
    defaultValue: listing?.applicationDropOffAddressType
      ? listing?.applicationDropOffAddressType
      : listing?.applicationDropOffAddress
      ? addressTypes.anotherAddress
      : null,
  })

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
            className={"font-semibold"}
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
        <GridSection columns={2}>
          <GridCell>
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
                    isNullOrUndefined(listing?.applicationPickUpAddress) === false ||
                    isNullOrUndefined(listing?.applicationPickUpAddressType) === false,
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
          </GridCell>
          <GridCell>
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
                    isNullOrUndefined(listing?.applicationDropOffAddress) === false ||
                    isNullOrUndefined(listing?.applicationDropOffAddressType) === false,
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
          </GridCell>
        </GridSection>
        <GridSection columns={2}>
          {applicationsPickedUp === YesNoAnswer.Yes && (
            <GridCell>
              <p className="field-label m-4 ml-0">{t("listings.wherePickupQuestion")}</p>
              <FieldGroup
                name="whereApplicationsPickedUp"
                type="radio"
                register={register}
                fields={getLocationOptions(
                  "pickUp",
                  listing?.applicationPickUpAddressType,
                  isNullOrUndefined(listing?.applicationPickUpAddress) === false
                )}
              />
            </GridCell>
          )}
          {applicationsDroppedOff === YesNoAnswer.Yes && (
            <>
              {applicationsPickedUp === YesNoAnswer.No && (
                <GridCell>
                  <></>
                </GridCell>
              )}
              <GridCell>
                <p className="field-label m-4 ml-0">{t("listings.whereDropOffQuestion")}</p>
                <FieldGroup
                  name="whereApplicationsDroppedOff"
                  type="radio"
                  register={register}
                  fields={getLocationOptions(
                    "dropOff",
                    listing?.applicationDropOffAddressType,
                    isNullOrUndefined(listing?.applicationDropOffAddress) === false
                  )}
                />
              </GridCell>
            </>
          )}
        </GridSection>

        {applicationsPickedUp === YesNoAnswer.Yes &&
          pickedUpAddressType === addressTypes.anotherAddress && (
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
        {applicationsDroppedOff === YesNoAnswer.Yes &&
          droppedOffAddressType === addressTypes.anotherAddress && (
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

        <GridSection columns={4} className={"flex items-center"}>
          <GridCell>
            <GridCell>
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
          </GridCell>
          <GridCell>
            {postmarksConsidered === YesNoAnswer.Yes && (
              <DateField
                label={t("listings.postmarkByDate")}
                name={"postmarkByDateDateField"}
                id={"postmarkByDateDateField"}
                register={register}
                watch={watch}
                defaultDate={{
                  month: listing?.postmarkedApplicationsReceivedByDate
                    ? moment(new Date(listing?.postmarkedApplicationsReceivedByDate))
                        .utc()
                        .format("MM")
                    : null,
                  day: listing?.postmarkedApplicationsReceivedByDate
                    ? moment(new Date(listing?.postmarkedApplicationsReceivedByDate))
                        .utc()
                        .format("DD")
                    : null,
                  year: listing?.postmarkedApplicationsReceivedByDate
                    ? moment(new Date(listing?.postmarkedApplicationsReceivedByDate))
                        .utc()
                        .format("YYYY")
                    : null,
                }}
                dataTestId={"postmark-date-field"}
              />
            )}
          </GridCell>
          <GridCell>
            {postmarksConsidered === YesNoAnswer.Yes && (
              <TimeField
                label={t("listings.postmarkByTime")}
                name={"postmarkByDateTimeField"}
                id={"postmarkByDateTimeField"}
                register={register}
                watch={watch}
                defaultValues={{
                  hours: listing?.postmarkedApplicationsReceivedByDate
                    ? moment(new Date(listing?.postmarkedApplicationsReceivedByDate)).format("hh")
                    : null,
                  minutes: listing?.postmarkedApplicationsReceivedByDate
                    ? moment(new Date(listing?.postmarkedApplicationsReceivedByDate)).format("mm")
                    : null,
                  seconds: listing?.postmarkedApplicationsReceivedByDate
                    ? moment(new Date(listing?.postmarkedApplicationsReceivedByDate)).format("ss")
                    : null,
                  period:
                    new Date(listing?.postmarkedApplicationsReceivedByDate).getHours() >= 12
                      ? "pm"
                      : "am",
                }}
                dataTestId={"postmark-time-field"}
              />
            )}
          </GridCell>
        </GridSection>
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
