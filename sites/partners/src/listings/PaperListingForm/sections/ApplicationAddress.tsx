import React, { useEffect } from "react"
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
import { FormListing, addressTypes } from "../formTypes"
import dayjs from "dayjs"
import { isNullOrUndefined } from "../../../../lib/helpers"

type ApplicationAddressProps = {
  listing?: FormListing
}

const ApplicationAddress = ({ listing }: ApplicationAddressProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, control, setValue } = formMethods

  // If leasing agent address does not exist, do not show it as a radio option
  const leasingAgentAddressStreet = useWatch({
    control,
    name: "leasingAgentAddress.street",
  })

  const leasingAgentAddressCity = useWatch({
    control,
    name: "leasingAgentAddress.city",
  })

  const leasingAgentAddressState = useWatch({
    control,
    name: "leasingAgentAddress.state",
  })

  const leasingAgentAddressZip = useWatch({
    control,
    name: "leasingAgentAddress.zipCode",
  })

  const leasingAgentAddressExists =
    leasingAgentAddressStreet &&
    leasingAgentAddressCity &&
    leasingAgentAddressState &&
    leasingAgentAddressZip

  // If leasing agent address is selected and becomes null, reset radio options
  useEffect(() => {
    if (!leasingAgentAddressExists) {
      setValue("whereApplicationsMailedIn", null)
      setValue("whereApplicationsDroppedOff", null)
      setValue("whereApplicationsPickedUp", null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leasingAgentAddressExists])

  const postmarksConsidered: YesNoAnswer = useWatch({
    control,
    name: "arePostmarksConsidered",
    defaultValue:
      listing && listing?.postmarkedApplicationsReceivedByDate !== null
        ? YesNoAnswer.Yes
        : YesNoAnswer.No,
  })

  const applicationsMailedIn: YesNoAnswer = useWatch({
    control,
    name: "canApplicationsBeMailedIn",
    defaultValue:
      listing?.applicationMailingAddress || listing?.applicationMailingAddressType
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

  const mailedInAddressType = useWatch({
    control,
    name: "whereApplicationsMailedIn",
    defaultValue: listing?.applicationMailingAddressType
      ? listing?.applicationMailingAddressType
      : listing?.applicationMailingAddress
      ? addressTypes.anotherAddress
      : null,
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
        disabled: !leasingAgentAddressExists,
      },
      {
        label: t("listings.atAnotherAddress"),
        defaultChecked: anotherAddressExists,
        value: addressTypes.anotherAddress,
      },
    ]
    return locationRadioOptions.map((option) => {
      const optionID = `${prefix}${option.value[0].toUpperCase() + option.value.slice(1)}`
      return { ...option, id: optionID }
    })
  }

  const dayjsDate = dayjs(new Date(listing?.postmarkedApplicationsReceivedByDate))

  return (
    <div>
      <GridSection grid={false}>
        <hr className="mt-6 mb-6" />
        <span className="form-section__title">{"Application Address"}</span>
        <span className="form-section__description">
          {
            "In the event of paper applications, where do you want applications mailed or dropped off?"
          }
        </span>
        <GridSection columns={3}>
          <GridCell>
            <GridCell span={2}>
              <p className="field-label m-4 ml-0">{"Can applications be mailed in?"}</p>
            </GridCell>
            <FieldGroup
              name="canApplicationsBeMailedIn"
              type="radio"
              register={register}
              fields={[
                {
                  ...yesNoRadioOptions[0],
                  id: "applicationsMailedInYes",
                  defaultChecked:
                    isNullOrUndefined(listing?.applicationMailingAddress) === false ||
                    isNullOrUndefined(listing?.applicationMailingAddressType) === false,
                },
                {
                  ...yesNoRadioOptions[1],
                  id: "applicationsMailedInNo",
                  defaultChecked:
                    listing?.applicationMailingAddress === null &&
                    listing?.applicationMailingAddressType === null,
                },
              ]}
            />
          </GridCell>
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
        <GridSection columns={3}>
          <GridCell>
            {applicationsMailedIn === YesNoAnswer.Yes && (
              <>
                <p className="field-label m-4 ml-0">{"Where are applications mailed in?"}</p>
                <FieldGroup
                  fieldGroupClassName="grid grid-cols-1"
                  fieldClassName="ml-0"
                  name="whereApplicationsMailedIn"
                  type="radio"
                  register={register}
                  fields={getLocationOptions(
                    "mailIn",
                    listing?.applicationMailingAddressType,
                    isNullOrUndefined(listing?.applicationMailingAddress) === false
                  )}
                />
              </>
            )}
          </GridCell>
          <GridCell>
            {applicationsPickedUp === YesNoAnswer.Yes && (
              <>
                <p className="field-label m-4 ml-0">{t("listings.wherePickupQuestion")}</p>
                <FieldGroup
                  fieldGroupClassName="grid grid-cols-1"
                  fieldClassName="ml-0"
                  name="whereApplicationsPickedUp"
                  type="radio"
                  register={register}
                  fields={getLocationOptions(
                    "pickUp",
                    listing?.applicationPickUpAddressType,
                    isNullOrUndefined(listing?.applicationPickUpAddress) === false
                  )}
                />
              </>
            )}
          </GridCell>
          <GridCell>
            {applicationsDroppedOff === YesNoAnswer.Yes && (
              <>
                <p className="field-label m-4 ml-0">{t("listings.whereDropOffQuestion")}</p>
                <FieldGroup
                  fieldGroupClassName="grid grid-cols-1"
                  fieldClassName="ml-0"
                  name="whereApplicationsDroppedOff"
                  type="radio"
                  register={register}
                  fields={getLocationOptions(
                    "dropOff",
                    listing?.applicationDropOffAddressType,
                    isNullOrUndefined(listing?.applicationDropOffAddress) === false
                  )}
                />
              </>
            )}
          </GridCell>
        </GridSection>
        {applicationsMailedIn === YesNoAnswer.Yes &&
          mailedInAddressType === addressTypes.anotherAddress && (
            <GridSection grid={false} subtitle={t("application.contact.mailingAddress")}>
              <GridSection columns={3}>
                <GridCell span={2}>
                  <Field
                    label={t("listings.streetAddressOrPOBox")}
                    name={"applicationMailingAddress.street"}
                    id={"applicationMailingAddress.street"}
                    register={register}
                    placeholder={t("application.contact.streetAddress")}
                    dataTestId={"mailing-address-street"}
                  />
                </GridCell>

                <Field
                  label={t("application.contact.apt")}
                  name={"applicationMailingAddress.street2"}
                  id={"applicationMailingAddress.street2"}
                  register={register}
                  placeholder={t("application.contact.apt")}
                  dataTestId={"mailing-address-street2"}
                />
              </GridSection>
              <GridSection columns={7}>
                <GridCell span={3}>
                  <Field
                    label={t("application.contact.city")}
                    name={"applicationMailingAddress.city"}
                    id={"applicationMailingAddress.city"}
                    register={register}
                    placeholder={t("application.contact.city")}
                    dataTestId={"mailing-address-city"}
                  />
                </GridCell>
                <GridCell span={2}>
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
                      dataTestId={"mailing-address-state"}
                    />
                  </ViewItem>
                </GridCell>
                <GridCell span={2}>
                  <Field
                    label={t("application.contact.zip")}
                    name={"applicationMailingAddress.zipCode"}
                    id={"applicationMailingAddress.zipCode"}
                    placeholder={t("application.contact.zip")}
                    errorMessage={t("errors.zipCodeError")}
                    register={register}
                    dataTestId={"mailing-address-zip"}
                  />
                </GridCell>
              </GridSection>
            </GridSection>
          )}
        {applicationsPickedUp === YesNoAnswer.Yes &&
          pickedUpAddressType === addressTypes.anotherAddress && (
            <GridSection grid={false} subtitle={t("listings.pickupAddress")}>
              <GridSection columns={3}>
                <GridCell span={2}>
                  <Field
                    label={t("listings.streetAddressOrPOBox")}
                    name={"applicationPickUpAddress.street"}
                    id={"applicationPickUpAddress.street"}
                    register={register}
                    placeholder={t("application.contact.streetAddress")}
                  />
                </GridCell>
                <Field
                  label={t("application.contact.apt")}
                  name={"applicationPickUpAddress.street2"}
                  id={"applicationPickUpAddress.street2"}
                  register={register}
                  placeholder={t("application.contact.apt")}
                />
              </GridSection>
              <GridSection columns={7}>
                <GridCell span={3}>
                  <Field
                    label={t("application.contact.city")}
                    name={"applicationPickUpAddress.city"}
                    id={"applicationPickUpAddress.city"}
                    register={register}
                    placeholder={t("application.contact.city")}
                  />
                </GridCell>
                <GridCell span={2}>
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
                </GridCell>
                <GridCell span={2}>
                  <Field
                    label={t("application.contact.zip")}
                    name={"applicationPickUpAddress.zipCode"}
                    id={"applicationPickUpAddress.zipCode"}
                    placeholder={t("application.contact.zip")}
                    errorMessage={t("errors.zipCodeError")}
                    register={register}
                  />
                </GridCell>
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
                <GridCell span={2}>
                  <Field
                    label={t("listings.streetAddressOrPOBox")}
                    name={"applicationDropOffAddress.street"}
                    id={"applicationDropOffAddress.street"}
                    register={register}
                    placeholder={t("application.contact.streetAddress")}
                  />
                </GridCell>
                <Field
                  label={t("application.contact.apt")}
                  name={"applicationDropOffAddress.street2"}
                  id={"applicationDropOffAddress.street2"}
                  register={register}
                  placeholder={t("application.contact.apt")}
                />
              </GridSection>
              <GridSection columns={7}>
                <GridCell span={3}>
                  <Field
                    label={t("application.contact.city")}
                    name={"applicationDropOffAddress.city"}
                    id={"applicationDropOffAddress.city"}
                    register={register}
                    placeholder={t("application.contact.city")}
                  />
                </GridCell>
                <GridCell span={2}>
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
                </GridCell>
                <GridCell span={2}>
                  <Field
                    label={t("application.contact.zip")}
                    name={"applicationDropOffAddress.zipCode"}
                    id={"applicationDropOffAddress.zipCode"}
                    placeholder={t("application.contact.zip")}
                    errorMessage={t("errors.zipCodeError")}
                    register={register}
                  />
                </GridCell>
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

        <GridSection columns={3}>
          <GridCell>
            <p className="field-label m-4 ml-0">{t("listings.postmarksConsideredQuestion")}</p>

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
          <GridCell className={"mt-4"}>
            {postmarksConsidered === YesNoAnswer.Yes && (
              <DateField
                label={t("listings.receivedByDate")}
                name={"postmarkByDateDateField"}
                id={"postmarkByDateDateField"}
                register={register}
                watch={watch}
                defaultDate={{
                  month: listing?.postmarkedApplicationsReceivedByDate
                    ? dayjsDate.format("MM")
                    : null,
                  day: listing?.postmarkedApplicationsReceivedByDate
                    ? dayjsDate.format("DD")
                    : null,
                  year: listing?.postmarkedApplicationsReceivedByDate
                    ? dayjsDate.format("YYYY")
                    : null,
                }}
                dataTestId={"postmark-date-field"}
              />
            )}
          </GridCell>
          <GridCell className={"mt-4"}>
            {postmarksConsidered === YesNoAnswer.Yes && (
              <TimeField
                label={t("listings.receivedByTime")}
                name={"postmarkByDateTimeField"}
                id={"postmarkByDateTimeField"}
                register={register}
                watch={watch}
                defaultValues={{
                  hours: listing?.postmarkedApplicationsReceivedByDate
                    ? dayjsDate.format("hh")
                    : null,
                  minutes: listing?.postmarkedApplicationsReceivedByDate
                    ? dayjsDate.format("mm")
                    : null,
                  seconds: listing?.postmarkedApplicationsReceivedByDate
                    ? dayjsDate.format("ss")
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
