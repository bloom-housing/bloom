import React, { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  t,
  Textarea,
  Field,
  Select,
  DateField,
  FieldGroup,
  TimeField,
} from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { stateKeys } from "@bloom-housing/shared-helpers"
import dayjs from "dayjs"
import { YesNoAnswer, isNullOrUndefined, fieldHasError } from "../../../../lib/helpers"
import { FormListing, addressTypes } from "../../../../lib/listings/formTypes"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type ApplicationAddressProps = {
  listing?: FormListing
}

const ApplicationAddress = ({ listing }: ApplicationAddressProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, control, setValue, errors, getValues, clearErrors } = formMethods

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
      if (mailedInAddressType === addressTypes.leasingAgent)
        setValue("whereApplicationsMailedIn", null)
      if (droppedOffAddressType === addressTypes.leasingAgent)
        setValue("whereApplicationsDroppedOff", null)
      if (pickedUpAddressType === addressTypes.leasingAgent)
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
      listing?.listingsApplicationMailingAddress || listing?.applicationMailingAddressType
        ? YesNoAnswer.Yes
        : YesNoAnswer.No,
  })

  const applicationsPickedUp: YesNoAnswer = useWatch({
    control,
    name: "canPaperApplicationsBePickedUp",
    defaultValue:
      listing?.listingsApplicationPickUpAddress || listing?.applicationPickUpAddressType
        ? YesNoAnswer.Yes
        : YesNoAnswer.No,
  })

  const applicationsDroppedOff: YesNoAnswer = useWatch({
    control,
    name: "canApplicationsBeDroppedOff",
    defaultValue:
      listing?.listingsApplicationDropOffAddress || listing?.applicationDropOffAddressType
        ? YesNoAnswer.Yes
        : YesNoAnswer.No,
  })

  const mailedInAddressType = useWatch({
    control,
    name: "whereApplicationsMailedIn",
    defaultValue: listing?.applicationMailingAddressType
      ? listing?.applicationMailingAddressType
      : listing?.listingsApplicationMailingAddress
      ? addressTypes.anotherAddress
      : null,
  })

  const pickedUpAddressType = useWatch({
    control,
    name: "whereApplicationsPickedUp",
    defaultValue: listing?.applicationPickUpAddressType
      ? listing?.applicationPickUpAddressType
      : listing?.listingsApplicationPickUpAddress
      ? addressTypes.anotherAddress
      : null,
  })

  const droppedOffAddressType = useWatch({
    control,
    name: "whereApplicationsDroppedOff",
    defaultValue: listing?.applicationDropOffAddressType
      ? listing?.applicationDropOffAddressType
      : listing?.listingsApplicationDropOffAddress
      ? addressTypes.anotherAddress
      : null,
  })

  const getPartialError = (fieldKey: string, fieldSubKey: string) => {
    if (fieldHasError(errors[fieldKey]) && !getValues(fieldSubKey)) {
      return t("errors.partialAddress")
    }
  }

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
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={"Application Address"}
        subheading={t("listings.sections.applicationAddressSubtitle")}
      >
        <Grid.Row columns={3}>
          <FieldValue label="Can applications be mailed in?">
            <FieldGroup
              name="canApplicationsBeMailedIn"
              type="radio"
              register={register}
              fields={[
                {
                  ...yesNoRadioOptions[0],
                  id: "applicationsMailedInYes",
                  defaultChecked:
                    isNullOrUndefined(listing?.listingsApplicationMailingAddress) === false ||
                    isNullOrUndefined(listing?.applicationMailingAddressType) === false,
                },
                {
                  ...yesNoRadioOptions[1],
                  id: "applicationsMailedInNo",
                  defaultChecked:
                    listing?.listingsApplicationMailingAddress === null &&
                    listing?.applicationMailingAddressType === null,
                },
              ]}
            />
          </FieldValue>
          <FieldValue label={t("listings.applicationPickupQuestion")}>
            <FieldGroup
              name="canPaperApplicationsBePickedUp"
              type="radio"
              register={register}
              fields={[
                {
                  ...yesNoRadioOptions[0],
                  id: "applicationsPickedUpYes",
                  defaultChecked:
                    isNullOrUndefined(listing?.listingsApplicationPickUpAddress) === false ||
                    isNullOrUndefined(listing?.applicationPickUpAddressType) === false,
                },
                {
                  ...yesNoRadioOptions[1],
                  id: "applicationsPickedUpNo",
                  defaultChecked:
                    listing?.listingsApplicationPickUpAddress === null &&
                    listing?.applicationPickUpAddressType === null,
                },
              ]}
            />
          </FieldValue>
          <FieldValue label={t("listings.applicationDropOffQuestion")}>
            <FieldGroup
              name="canApplicationsBeDroppedOff"
              type="radio"
              register={register}
              fields={[
                {
                  ...yesNoRadioOptions[0],
                  id: "applicationsDroppedOffYes",
                  defaultChecked:
                    isNullOrUndefined(listing?.listingsApplicationDropOffAddress) === false ||
                    isNullOrUndefined(listing?.applicationDropOffAddressType) === false,
                },
                {
                  ...yesNoRadioOptions[1],
                  id: "applicationsDroppedOffNo",
                  defaultChecked:
                    listing?.listingsApplicationDropOffAddress === null &&
                    listing?.applicationDropOffAddressType === null,
                },
              ]}
            />
          </FieldValue>
        </Grid.Row>
        <Grid.Row columns={3}>
          {applicationsMailedIn === YesNoAnswer.Yes ? (
            <FieldValue label="Where are applications mailed in?">
              <FieldGroup
                fieldGroupClassName="grid grid-cols-1"
                fieldClassName="ml-0"
                name="whereApplicationsMailedIn"
                type="radio"
                register={register}
                fields={getLocationOptions(
                  "mailIn",
                  listing?.applicationMailingAddressType,
                  isNullOrUndefined(listing?.listingsApplicationMailingAddress) === false
                )}
              />
            </FieldValue>
          ) : (
            <Grid.Cell> </Grid.Cell>
          )}

          {applicationsPickedUp === YesNoAnswer.Yes ? (
            <FieldValue label={t("listings.wherePickupQuestion")}>
              <FieldGroup
                fieldGroupClassName="grid grid-cols-1"
                fieldClassName="ml-0"
                name="whereApplicationsPickedUp"
                type="radio"
                register={register}
                fields={getLocationOptions(
                  "pickUp",
                  listing?.applicationPickUpAddressType,
                  isNullOrUndefined(listing?.listingsApplicationPickUpAddress) === false
                )}
              />
            </FieldValue>
          ) : (
            <Grid.Cell> </Grid.Cell>
          )}

          {applicationsDroppedOff === YesNoAnswer.Yes ? (
            <FieldValue label={t("listings.whereDropOffQuestion")}>
              <FieldGroup
                fieldGroupClassName="grid grid-cols-1"
                fieldClassName="ml-0"
                name="whereApplicationsDroppedOff"
                type="radio"
                register={register}
                fields={getLocationOptions(
                  "dropOff",
                  listing?.applicationDropOffAddressType,
                  isNullOrUndefined(listing?.listingsApplicationDropOffAddress) === false
                )}
              />
            </FieldValue>
          ) : (
            <Grid.Cell> </Grid.Cell>
          )}
        </Grid.Row>
        {applicationsMailedIn === YesNoAnswer.Yes &&
          mailedInAddressType === addressTypes.anotherAddress && (
            <>
              <SectionWithGrid.HeadingRow>
                {t("application.contact.mailingAddress")}
              </SectionWithGrid.HeadingRow>
              <Grid.Row columns={3}>
                <Grid.Cell className="seeds-grid-span-2">
                  <Field
                    label={t("listings.streetAddressOrPOBox")}
                    name={"applicationMailingAddress.street"}
                    id={"applicationMailingAddress.street"}
                    register={register}
                    placeholder={t("application.contact.streetAddress")}
                    dataTestId={"mailing-address-street"}
                    errorMessage={getPartialError(
                      "applicationMailingAddress",
                      "applicationMailingAddress.street"
                    )}
                    error={
                      !!getPartialError(
                        "applicationMailingAddress",
                        "applicationMailingAddress.street"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("applicationMailingAddress"),
                    }}
                  />
                </Grid.Cell>
                <Grid.Cell>
                  <Field
                    label={t("application.contact.apt")}
                    name={"applicationMailingAddress.street2"}
                    id={"applicationMailingAddress.street2"}
                    register={register}
                    placeholder={t("application.contact.apt")}
                    dataTestId={"mailing-address-street2"}
                  />
                </Grid.Cell>
              </Grid.Row>
              <Grid.Row columns={7}>
                <Grid.Cell className="seeds-grid-span-3">
                  <Field
                    label={t("application.contact.city")}
                    name={"applicationMailingAddress.city"}
                    id={"applicationMailingAddress.city"}
                    register={register}
                    placeholder={t("application.contact.city")}
                    dataTestId={"mailing-address-city"}
                    errorMessage={getPartialError(
                      "applicationMailingAddress",
                      "applicationMailingAddress.city"
                    )}
                    error={
                      !!getPartialError(
                        "applicationMailingAddress",
                        "applicationMailingAddress.city"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("applicationMailingAddress"),
                    }}
                  />
                </Grid.Cell>
                <Grid.Cell className="seeds-grid-span-2">
                  <FieldValue label={t("application.contact.state")} className="mb-0">
                    <Select
                      id={`applicationMailingAddress.state`}
                      name={`applicationMailingAddress.state`}
                      label={t("application.contact.state")}
                      labelClassName="sr-only"
                      register={register}
                      controlClassName="control"
                      options={stateKeys}
                      keyPrefix="states"
                      dataTestId={"mailing-address-state"}
                      errorMessage={getPartialError(
                        "applicationMailingAddress",
                        "applicationMailingAddress.state"
                      )}
                      error={
                        !!getPartialError(
                          "applicationMailingAddress",
                          "applicationMailingAddress.state"
                        )
                      }
                      inputProps={{
                        onChange: () => clearErrors("applicationMailingAddress"),
                      }}
                    />
                  </FieldValue>
                </Grid.Cell>
                <Grid.Cell className="seeds-grid-span-2">
                  <Field
                    label={t("application.contact.zip")}
                    name={"applicationMailingAddress.zipCode"}
                    id={"applicationMailingAddress.zipCode"}
                    placeholder={t("application.contact.zip")}
                    register={register}
                    dataTestId={"mailing-address-zip"}
                    errorMessage={getPartialError(
                      "applicationMailingAddress",
                      "applicationMailingAddress.zipCode"
                    )}
                    error={
                      !!getPartialError(
                        "applicationMailingAddress",
                        "applicationMailingAddress.zipCode"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("applicationMailingAddress"),
                    }}
                  />
                </Grid.Cell>
              </Grid.Row>
            </>
          )}
        {applicationsPickedUp === YesNoAnswer.Yes &&
          pickedUpAddressType === addressTypes.anotherAddress && (
            <>
              <SectionWithGrid.HeadingRow>{t("listings.pickupAddress")}</SectionWithGrid.HeadingRow>
              <Grid.Row columns={3}>
                <Grid.Cell className="seeds-grid-span-2">
                  <Field
                    label={t("listings.streetAddressOrPOBox")}
                    name={"applicationPickUpAddress.street"}
                    id={"applicationPickUpAddress.street"}
                    register={register}
                    placeholder={t("application.contact.streetAddress")}
                    errorMessage={getPartialError(
                      "applicationPickUpAddress",
                      "applicationPickUpAddress.street"
                    )}
                    error={
                      !!getPartialError(
                        "applicationPickUpAddress",
                        "applicationPickUpAddress.street"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("applicationPickUpAddress"),
                    }}
                  />
                </Grid.Cell>
                <Field
                  label={t("application.contact.apt")}
                  name={"applicationPickUpAddress.street2"}
                  id={"applicationPickUpAddress.street2"}
                  register={register}
                  placeholder={t("application.contact.apt")}
                />
              </Grid.Row>
              <Grid.Row columns={7}>
                <Grid.Cell className="seeds-grid-span-3">
                  <Field
                    label={t("application.contact.city")}
                    name={"applicationPickUpAddress.city"}
                    id={"applicationPickUpAddress.city"}
                    register={register}
                    placeholder={t("application.contact.city")}
                    errorMessage={getPartialError(
                      "applicationPickUpAddress",
                      "applicationPickUpAddress.city"
                    )}
                    error={
                      !!getPartialError("applicationPickUpAddress", "applicationPickUpAddress.city")
                    }
                    inputProps={{
                      onChange: () => clearErrors("applicationPickUpAddress"),
                    }}
                  />
                </Grid.Cell>
                <Grid.Cell className="seeds-grid-span-2">
                  <FieldValue label={t("application.contact.state")} className="mb-0">
                    <Select
                      id={`applicationPickUpAddress.state`}
                      name={`applicationPickUpAddress.state`}
                      label={t("application.contact.state")}
                      labelClassName="sr-only"
                      register={register}
                      controlClassName="control"
                      options={stateKeys}
                      keyPrefix="states"
                      errorMessage={getPartialError(
                        "applicationPickUpAddress",
                        "applicationPickUpAddress.state"
                      )}
                      error={
                        !!getPartialError(
                          "applicationPickUpAddress",
                          "applicationPickUpAddress.state"
                        )
                      }
                      inputProps={{
                        onChange: () => clearErrors("applicationPickUpAddress"),
                      }}
                    />
                  </FieldValue>
                </Grid.Cell>
                <Grid.Cell className="seeds-grid-span-2">
                  <Field
                    label={t("application.contact.zip")}
                    name={"applicationPickUpAddress.zipCode"}
                    id={"applicationPickUpAddress.zipCode"}
                    placeholder={t("application.contact.zip")}
                    register={register}
                    errorMessage={getPartialError(
                      "applicationPickUpAddress",
                      "applicationPickUpAddress.zipCode"
                    )}
                    error={
                      !!getPartialError(
                        "applicationPickUpAddress",
                        "applicationPickUpAddress.zipCode"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("applicationPickUpAddress"),
                    }}
                  />
                </Grid.Cell>
              </Grid.Row>
              <Grid.Row columns={3}>
                <Grid.Cell className="seeds-grid-span-2">
                  <Textarea
                    label={t("leasingAgent.officeHours")}
                    name={"applicationPickUpAddressOfficeHours"}
                    id={"applicationPickUpAddressOfficeHours"}
                    fullWidth={true}
                    register={register}
                    placeholder={t("leasingAgent.officeHoursPlaceholder")}
                  />
                </Grid.Cell>
              </Grid.Row>
            </>
          )}
        {applicationsDroppedOff === YesNoAnswer.Yes &&
          droppedOffAddressType === addressTypes.anotherAddress && (
            <>
              <SectionWithGrid.HeadingRow>
                {t("listings.dropOffAddress")}
              </SectionWithGrid.HeadingRow>
              <Grid.Row columns={3}>
                <Grid.Cell className="seeds-grid-span-2">
                  <Field
                    label={t("listings.streetAddressOrPOBox")}
                    name={"applicationDropOffAddress.street"}
                    id={"applicationDropOffAddress.street"}
                    register={register}
                    placeholder={t("application.contact.streetAddress")}
                    errorMessage={getPartialError(
                      "applicationDropOffAddress",
                      "applicationDropOffAddress.street"
                    )}
                    error={
                      !!getPartialError(
                        "applicationDropOffAddress",
                        "applicationDropOffAddress.street"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("applicationDropOffAddress"),
                    }}
                  />
                </Grid.Cell>
                <Field
                  label={t("application.contact.apt")}
                  name={"applicationDropOffAddress.street2"}
                  id={"applicationDropOffAddress.street2"}
                  register={register}
                  placeholder={t("application.contact.apt")}
                />
              </Grid.Row>
              <Grid.Row columns={7}>
                <Grid.Cell className="seeds-grid-span-3">
                  <Field
                    label={t("application.contact.city")}
                    name={"applicationDropOffAddress.city"}
                    id={"applicationDropOffAddress.city"}
                    register={register}
                    placeholder={t("application.contact.city")}
                    errorMessage={getPartialError(
                      "applicationDropOffAddress",
                      "applicationDropOffAddress.city"
                    )}
                    error={
                      !!getPartialError(
                        "applicationDropOffAddress",
                        "applicationDropOffAddress.city"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("applicationDropOffAddress"),
                    }}
                  />
                </Grid.Cell>
                <Grid.Cell className="seeds-grid-span-2">
                  <FieldValue label={t("application.contact.state")} className="mb-0">
                    <Select
                      id={`applicationDropOffAddress.state`}
                      name={`applicationDropOffAddress.state`}
                      label={t("application.contact.state")}
                      labelClassName="sr-only"
                      register={register}
                      controlClassName="control"
                      options={stateKeys}
                      keyPrefix="states"
                      errorMessage={getPartialError(
                        "applicationDropOffAddress",
                        "applicationDropOffAddress.state"
                      )}
                      error={
                        !!getPartialError(
                          "applicationDropOffAddress",
                          "applicationDropOffAddress.state"
                        )
                      }
                      inputProps={{
                        onChange: () => clearErrors("applicationDropOffAddress"),
                      }}
                    />
                  </FieldValue>
                </Grid.Cell>
                <Grid.Cell className="seeds-grid-span-2">
                  <Field
                    label={t("application.contact.zip")}
                    name={"applicationDropOffAddress.zipCode"}
                    id={"applicationDropOffAddress.zipCode"}
                    placeholder={t("application.contact.zip")}
                    register={register}
                    errorMessage={getPartialError(
                      "applicationDropOffAddress",
                      "applicationDropOffAddress.zipCode"
                    )}
                    error={
                      !!getPartialError(
                        "applicationDropOffAddress",
                        "applicationDropOffAddress.zipCode"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("applicationDropOffAddress"),
                    }}
                  />
                </Grid.Cell>
              </Grid.Row>
              <Grid.Row columns={3}>
                <Grid.Cell className="seeds-grid-span-2">
                  <Textarea
                    label={t("leasingAgent.officeHours")}
                    name={"applicationDropOffAddressOfficeHours"}
                    id={"applicationDropOffAddressOfficeHours"}
                    fullWidth={true}
                    register={register}
                    placeholder={t("leasingAgent.officeHoursPlaceholder")}
                  />
                </Grid.Cell>
              </Grid.Row>
            </>
          )}

        <Grid.Row columns={3}>
          <FieldValue label={t("listings.postmarksConsideredQuestion")}>
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
          </FieldValue>
          <Grid.Cell className={"mt-4"}>
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
          </Grid.Cell>
          <Grid.Cell className={"mt-4"}>
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
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row columns={3}>
          <Grid.Cell className="seeds-grid-span-2">
            <Textarea
              label={t("listings.additionalApplicationSubmissionNotes")}
              name={"additionalApplicationSubmissionNotes"}
              id={"additionalApplicationSubmissionNotes"}
              fullWidth={true}
              register={register}
              placeholder={t("t.addNotes")}
            />
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export default ApplicationAddress
