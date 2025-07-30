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
import { YesNoEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Grid } from "@bloom-housing/ui-seeds"
import { stateKeys } from "@bloom-housing/shared-helpers"
import dayjs from "dayjs"
import { isNullOrUndefined, fieldHasError, defaultFieldProps } from "../../../../lib/helpers"
import { FormListing, addressTypes } from "../../../../lib/listings/formTypes"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import styles from "../ListingForm.module.scss"

type ApplicationAddressProps = {
  listing?: FormListing
  requiredFields: string[]
}

const ApplicationAddress = ({ listing, requiredFields }: ApplicationAddressProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, control, setValue, errors, getValues, clearErrors } = formMethods

  // If leasing agent address does not exist, do not show it as a radio option
  const leasingAgentAddressStreet = useWatch({
    control,
    name: "listingsLeasingAgentAddress.street",
  })

  const leasingAgentAddressCity = useWatch({
    control,
    name: "listingsLeasingAgentAddress.city",
  })

  const leasingAgentAddressState = useWatch({
    control,
    name: "listingsLeasingAgentAddress.state",
  })

  const leasingAgentAddressZip = useWatch({
    control,
    name: "listingsLeasingAgentAddress.zipCode",
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

  const postmarksConsidered: YesNoEnum = useWatch({
    control,
    name: "arePostmarksConsidered",
    defaultValue:
      listing && listing?.postmarkedApplicationsReceivedByDate !== null
        ? YesNoEnum.yes
        : YesNoEnum.no,
  })

  const applicationsMailedIn: YesNoEnum = useWatch({
    control,
    name: "canApplicationsBeMailedIn",
    defaultValue:
      listing?.listingsApplicationMailingAddress || listing?.applicationMailingAddressType
        ? YesNoEnum.yes
        : YesNoEnum.no,
  })

  const applicationsPickedUp: YesNoEnum = useWatch({
    control,
    name: "canPaperApplicationsBePickedUp",
    defaultValue:
      listing?.listingsApplicationPickUpAddress || listing?.applicationPickUpAddressType
        ? YesNoEnum.yes
        : YesNoEnum.no,
  })

  const applicationsDroppedOff: YesNoEnum = useWatch({
    control,
    name: "canApplicationsBeDroppedOff",
    defaultValue:
      listing?.listingsApplicationDropOffAddress || listing?.applicationDropOffAddressType
        ? YesNoEnum.yes
        : YesNoEnum.no,
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
      value: YesNoEnum.yes,
    },
    {
      label: t("t.no"),
      value: YesNoEnum.no,
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
          <Grid.Cell>
            <FieldGroup
              name="canApplicationsBeMailedIn"
              type="radio"
              register={register}
              fieldLabelClassName={`${styles["label-option"]} seeds-m-bs-2`}
              groupLabel={"Can applications be mailed in?"}
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
          </Grid.Cell>
          <Grid.Cell>
            <FieldGroup
              name="canPaperApplicationsBePickedUp"
              type="radio"
              register={register}
              fieldLabelClassName={`${styles["label-option"]} seeds-m-bs-2`}
              groupLabel={t("listings.applicationPickupQuestion")}
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
          </Grid.Cell>
          <Grid.Cell>
            <FieldGroup
              name="canApplicationsBeDroppedOff"
              type="radio"
              register={register}
              fieldLabelClassName={`${styles["label-option"]} seeds-m-bs-2`}
              groupLabel={t("listings.applicationDropOffQuestion")}
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
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row columns={3}>
          {applicationsMailedIn === YesNoEnum.yes ? (
            <Grid.Cell>
              <FieldGroup
                fieldGroupClassName="grid grid-cols-1"
                fieldClassName="ml-0"
                name="whereApplicationsMailedIn"
                type="radio"
                register={register}
                fieldLabelClassName={`${styles["label-option"]} seeds-m-bs-2`}
                groupLabel={"Where are applications mailed in?"}
                fields={getLocationOptions(
                  "mailIn",
                  listing?.applicationMailingAddressType,
                  isNullOrUndefined(listing?.listingsApplicationMailingAddress) === false
                )}
              />
            </Grid.Cell>
          ) : (
            <Grid.Cell> </Grid.Cell>
          )}

          {applicationsPickedUp === YesNoEnum.yes ? (
            <Grid.Cell>
              <FieldGroup
                fieldGroupClassName="grid grid-cols-1"
                fieldClassName="ml-0"
                name="whereApplicationsPickedUp"
                type="radio"
                register={register}
                fieldLabelClassName={`${styles["label-option"]} seeds-m-bs-2`}
                groupLabel={t("listings.wherePickupQuestion")}
                fields={getLocationOptions(
                  "pickUp",
                  listing?.applicationPickUpAddressType,
                  isNullOrUndefined(listing?.listingsApplicationPickUpAddress) === false
                )}
              />
            </Grid.Cell>
          ) : (
            <Grid.Cell> </Grid.Cell>
          )}

          {applicationsDroppedOff === YesNoEnum.yes ? (
            <Grid.Cell>
              <FieldGroup
                fieldGroupClassName="grid grid-cols-1"
                fieldClassName="ml-0"
                name="whereApplicationsDroppedOff"
                type="radio"
                register={register}
                fieldLabelClassName={`${styles["label-option"]} seeds-m-bs-2`}
                groupLabel={t("listings.whereDropOffQuestion")}
                fields={getLocationOptions(
                  "dropOff",
                  listing?.applicationDropOffAddressType,
                  isNullOrUndefined(listing?.listingsApplicationDropOffAddress) === false
                )}
              />
            </Grid.Cell>
          ) : (
            <Grid.Cell> </Grid.Cell>
          )}
        </Grid.Row>
        {applicationsMailedIn === YesNoEnum.yes &&
          mailedInAddressType === addressTypes.anotherAddress && (
            <>
              <SectionWithGrid.HeadingRow>
                {t("application.contact.mailingAddress")}
              </SectionWithGrid.HeadingRow>
              <Grid.Row columns={3}>
                <Grid.Cell className="seeds-grid-span-2">
                  <Field
                    label={t("listings.streetAddressOrPOBox")}
                    name={"listingsApplicationMailingAddress.street"}
                    id={"listingsApplicationMailingAddress.street"}
                    register={register}
                    dataTestId={"mailing-address-street"}
                    errorMessage={getPartialError(
                      "listingsApplicationMailingAddress",
                      "listingsApplicationMailingAddress.street"
                    )}
                    error={
                      !!getPartialError(
                        "listingsApplicationMailingAddress",
                        "listingsApplicationMailingAddress.street"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("listingsApplicationMailingAddress"),
                    }}
                  />
                </Grid.Cell>
                <Grid.Cell>
                  <Field
                    label={t("application.contact.apt")}
                    name={"listingsApplicationMailingAddress.street2"}
                    id={"listingsApplicationMailingAddress.street2"}
                    register={register}
                    dataTestId={"mailing-address-street2"}
                  />
                </Grid.Cell>
              </Grid.Row>
              <Grid.Row columns={7}>
                <Grid.Cell className="seeds-grid-span-3">
                  <Field
                    label={t("application.contact.city")}
                    name={"listingsApplicationMailingAddress.city"}
                    id={"listingsApplicationMailingAddress.city"}
                    register={register}
                    dataTestId={"mailing-address-city"}
                    errorMessage={getPartialError(
                      "listingsApplicationMailingAddress",
                      "listingsApplicationMailingAddress.city"
                    )}
                    error={
                      !!getPartialError(
                        "listingsApplicationMailingAddress",
                        "listingsApplicationMailingAddress.city"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("listingsApplicationMailingAddress"),
                    }}
                  />
                </Grid.Cell>
                <Grid.Cell className="seeds-grid-span-2">
                  <Select
                    id={`listingsApplicationMailingAddress.state`}
                    name={`listingsApplicationMailingAddress.state`}
                    label={t("application.contact.state")}
                    register={register}
                    controlClassName="control"
                    options={stateKeys}
                    keyPrefix="states"
                    dataTestId={"mailing-address-state"}
                    errorMessage={getPartialError(
                      "listingsApplicationMailingAddress",
                      "listingsApplicationMailingAddress.state"
                    )}
                    error={
                      !!getPartialError(
                        "listingsApplicationMailingAddress",
                        "listingsApplicationMailingAddress.state"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("listingsApplicationMailingAddress"),
                    }}
                  />
                </Grid.Cell>
                <Grid.Cell className="seeds-grid-span-2">
                  <Field
                    label={t("application.contact.zip")}
                    name={"listingsApplicationMailingAddress.zipCode"}
                    id={"listingsApplicationMailingAddress.zipCode"}
                    register={register}
                    dataTestId={"mailing-address-zip"}
                    errorMessage={getPartialError(
                      "listingsApplicationMailingAddress",
                      "listingsApplicationMailingAddress.zipCode"
                    )}
                    error={
                      !!getPartialError(
                        "listingsApplicationMailingAddress",
                        "listingsApplicationMailingAddress.zipCode"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("listingsApplicationMailingAddress"),
                    }}
                  />
                </Grid.Cell>
              </Grid.Row>
            </>
          )}
        {applicationsPickedUp === YesNoEnum.yes &&
          pickedUpAddressType === addressTypes.anotherAddress && (
            <>
              <SectionWithGrid.HeadingRow>{t("listings.pickupAddress")}</SectionWithGrid.HeadingRow>
              <Grid.Row columns={3}>
                <Grid.Cell className="seeds-grid-span-2">
                  <Field
                    label={t("listings.streetAddressOrPOBox")}
                    name={"listingsApplicationPickUpAddress.street"}
                    id={"listingsApplicationPickUpAddress.street"}
                    register={register}
                    errorMessage={getPartialError(
                      "listingsApplicationPickUpAddress",
                      "listingsApplicationPickUpAddress.street"
                    )}
                    error={
                      !!getPartialError(
                        "listingsApplicationPickUpAddress",
                        "listingsApplicationPickUpAddress.street"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("listingsApplicationPickUpAddress"),
                    }}
                  />
                </Grid.Cell>
                <Field
                  label={t("application.contact.apt")}
                  name={"listingsApplicationPickUpAddress.street2"}
                  id={"listingsApplicationPickUpAddress.street2"}
                  register={register}
                />
              </Grid.Row>
              <Grid.Row columns={7}>
                <Grid.Cell className="seeds-grid-span-3">
                  <Field
                    label={t("application.contact.city")}
                    name={"listingsApplicationPickUpAddress.city"}
                    id={"listingsApplicationPickUpAddress.city"}
                    register={register}
                    errorMessage={getPartialError(
                      "listingsApplicationPickUpAddress",
                      "listingsApplicationPickUpAddress.city"
                    )}
                    error={
                      !!getPartialError(
                        "listingsApplicationPickUpAddress",
                        "listingsApplicationPickUpAddress.city"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("listingsApplicationPickUpAddress"),
                    }}
                  />
                </Grid.Cell>
                <Grid.Cell className="seeds-grid-span-2">
                  <Select
                    id={`listingsApplicationPickUpAddress.state`}
                    name={`listingsApplicationPickUpAddress.state`}
                    label={t("application.contact.state")}
                    register={register}
                    controlClassName="control"
                    options={stateKeys}
                    keyPrefix="states"
                    errorMessage={getPartialError(
                      "listingsApplicationPickUpAddress",
                      "listingsApplicationPickUpAddress.state"
                    )}
                    error={
                      !!getPartialError(
                        "listingsApplicationPickUpAddress",
                        "listingsApplicationPickUpAddress.state"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("listingsApplicationPickUpAddress"),
                    }}
                  />
                </Grid.Cell>
                <Grid.Cell className="seeds-grid-span-2">
                  <Field
                    label={t("application.contact.zip")}
                    name={"listingsApplicationPickUpAddress.zipCode"}
                    id={"listingsApplicationPickUpAddress.zipCode"}
                    register={register}
                    errorMessage={getPartialError(
                      "listingsApplicationPickUpAddress",
                      "listingsApplicationPickUpAddress.zipCode"
                    )}
                    error={
                      !!getPartialError(
                        "listingsApplicationPickUpAddress",
                        "listingsApplicationPickUpAddress.zipCode"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("listingsApplicationPickUpAddress"),
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
                    placeholder=""
                    note={t("leasingAgent.officeHoursPlaceholder")}
                  />
                </Grid.Cell>
              </Grid.Row>
            </>
          )}
        {applicationsDroppedOff === YesNoEnum.yes &&
          droppedOffAddressType === addressTypes.anotherAddress && (
            <>
              <SectionWithGrid.HeadingRow>
                {t("listings.dropOffAddress")}
              </SectionWithGrid.HeadingRow>
              <Grid.Row columns={3}>
                <Grid.Cell className="seeds-grid-span-2">
                  <Field
                    label={t("listings.streetAddressOrPOBox")}
                    name={"listingsApplicationDropOffAddress.street"}
                    id={"listingsApplicationDropOffAddress.street"}
                    register={register}
                    errorMessage={getPartialError(
                      "listingsApplicationDropOffAddress",
                      "listingsApplicationDropOffAddress.street"
                    )}
                    error={
                      !!getPartialError(
                        "listingsApplicationDropOffAddress",
                        "listingsApplicationDropOffAddress.street"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("listingsApplicationDropOffAddress"),
                    }}
                  />
                </Grid.Cell>
                <Field
                  label={t("application.contact.apt")}
                  name={"listingsApplicationDropOffAddress.street2"}
                  id={"listingsApplicationDropOffAddress.street2"}
                  register={register}
                />
              </Grid.Row>
              <Grid.Row columns={7}>
                <Grid.Cell className="seeds-grid-span-3">
                  <Field
                    label={t("application.contact.city")}
                    name={"listingsApplicationDropOffAddress.city"}
                    id={"listingsApplicationDropOffAddress.city"}
                    register={register}
                    errorMessage={getPartialError(
                      "listingsApplicationDropOffAddress",
                      "listingsApplicationDropOffAddress.city"
                    )}
                    error={
                      !!getPartialError(
                        "listingsApplicationDropOffAddress",
                        "listingsApplicationDropOffAddress.city"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("listingsApplicationDropOffAddress"),
                    }}
                  />
                </Grid.Cell>
                <Grid.Cell className="seeds-grid-span-2">
                  <Select
                    id={`listingsApplicationDropOffAddress.state`}
                    name={`listingsApplicationDropOffAddress.state`}
                    label={t("application.contact.state")}
                    register={register}
                    controlClassName="control"
                    options={stateKeys}
                    keyPrefix="states"
                    errorMessage={getPartialError(
                      "listingsApplicationDropOffAddress",
                      "listingsApplicationDropOffAddress.state"
                    )}
                    error={
                      !!getPartialError(
                        "listingsApplicationDropOffAddress",
                        "listingsApplicationDropOffAddress.state"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("listingsApplicationDropOffAddress"),
                    }}
                  />
                </Grid.Cell>
                <Grid.Cell className="seeds-grid-span-2">
                  <Field
                    label={t("application.contact.zip")}
                    name={"listingsApplicationDropOffAddress.zipCode"}
                    id={"listingsApplicationDropOffAddress.zipCode"}
                    register={register}
                    errorMessage={getPartialError(
                      "listingsApplicationDropOffAddress",
                      "listingsApplicationDropOffAddress.zipCode"
                    )}
                    error={
                      !!getPartialError(
                        "listingsApplicationDropOffAddress",
                        "listingsApplicationDropOffAddress.zipCode"
                      )
                    }
                    inputProps={{
                      onChange: () => clearErrors("listingsApplicationDropOffAddress"),
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
                    placeholder=""
                    note={t("leasingAgent.officeHoursPlaceholder")}
                  />
                </Grid.Cell>
              </Grid.Row>
            </>
          )}

        <Grid.Row columns={3}>
          <Grid.Cell>
            <FieldGroup
              name="arePostmarksConsidered"
              type="radio"
              fieldLabelClassName={`${styles["label-option"]} seeds-m-bs-2`}
              groupLabel={t("listings.postmarksConsideredQuestion")}
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
          </Grid.Cell>
          <Grid.Cell className={"mt-4"}>
            {postmarksConsidered === YesNoEnum.yes && (
              <DateField
                label={t("listings.receivedByDate")}
                name={"postmarkByDateDateField"}
                id={"postmarkByDateDateField"}
                register={register}
                setValue={setValue}
                watch={watch}
                error={errors?.postmarkByDateDateField}
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
            {postmarksConsidered === YesNoEnum.yes && (
              <TimeField
                label={t("listings.receivedByTime")}
                name={"postmarkByDateTimeField"}
                id={"postmarkByDateTimeField"}
                register={register}
                setValue={setValue}
                watch={watch}
                error={errors?.postmarkByDateTimeField}
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
              fullWidth={true}
              register={register}
              placeholder={""}
              {...defaultFieldProps(
                "additionalApplicationSubmissionNotes",
                t("listings.additionalApplicationSubmissionNotes"),
                requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export default ApplicationAddress
