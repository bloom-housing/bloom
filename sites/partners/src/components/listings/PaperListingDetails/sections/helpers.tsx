import React from "react"
import { AddressCreate } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import dayjs from "dayjs"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { TextEditorContent } from "../../../shared/TextEditor"

export const getDetailFieldNumber = (listingNumber: number) => {
  return listingNumber ? listingNumber.toString() : t("t.none")
}

export const getDetailFieldString = (listingString: string) => {
  return listingString && listingString !== "" ? listingString : t("t.none")
}

export const getDetailFieldRichText = (listingString: string, fieldId: string) => {
  return listingString && listingString !== "" ? (
    <TextEditorContent content={listingString} contentId={fieldId} />
  ) : (
    t("t.none")
  )
}

export const getDetailFieldDate = (listingDate: Date) => {
  return listingDate ? dayjs(new Date(listingDate)).format("MM/DD/YYYY") : t("t.none")
}

export const getDetailFieldTime = (listingTime: Date) => {
  return listingTime ? dayjs(new Date(listingTime)).format("hh:mm A") : t("t.none")
}

export const getDetailBoolean = (listingBool: boolean) => {
  return listingBool === true ? t("t.yes") : listingBool === false ? t("t.no") : t("t.n/a")
}

export const cleanRichText = (listingString: string) => {
  if (listingString === `<p></p>`) return null
  return listingString
}

export const getReadableErrorMessage = (errorMessage: string | undefined) => {
  const errorDetails = errorMessage.substring(errorMessage.indexOf(" ") + 1)
  let readableMessage = null
  switch (errorDetails) {
    case "must have https://":
      readableMessage = t("errors.urlHttpsError")
      break
    case "must be a URL address":
      readableMessage = t("errors.urlError")
      break
    case "must be an email":
      readableMessage = t("errors.emailAddressError")
      break
    case "must be a valid phone number":
      readableMessage = t("errors.phoneNumberError")
      break
    default:
      readableMessage = t("errors.requiredFieldError")
  }
  return readableMessage
}

type AddressType =
  | "leasingAgentAddress"
  | "applicationMailingAddress"
  | "applicationPickUpAddress"
  | "applicationDropOffAddress"

export const getDetailAddress = (
  address: AddressCreate,
  addressName: AddressType,
  subtitle: string
) => {
  if (!address) {
    return (
      <>
        <SectionWithGrid.HeadingRow>{subtitle}</SectionWithGrid.HeadingRow>
        <Grid.Row>{getDetailFieldString(null)}</Grid.Row>
      </>
    )
  }
  return (
    <>
      <SectionWithGrid.HeadingRow>{subtitle}</SectionWithGrid.HeadingRow>
      <Grid.Row>
        <FieldValue
          id={`${addressName}.street`}
          label={t("listings.streetAddressOrPOBox")}
          testId={`${addressName}.street`}
        >
          {getDetailFieldString(address?.street)}
        </FieldValue>
        <FieldValue
          id={`${addressName}.street2`}
          label={t("application.contact.apt")}
          testId={`${addressName}.street2`}
        >
          {getDetailFieldString(address?.street2)}
        </FieldValue>
      </Grid.Row>
      <Grid.Row columns={6}>
        <FieldValue
          id={`${addressName}.city`}
          className="seeds-grid-span-2"
          label={t("application.contact.city")}
          testId={`${addressName}.city`}
        >
          {getDetailFieldString(address?.city)}
        </FieldValue>
        <FieldValue
          id={`${addressName}.state`}
          label={t("application.contact.state")}
          testId={`${addressName}.state`}
        >
          {getDetailFieldString(address?.state)}
        </FieldValue>
        <FieldValue
          id={`${addressName}.zipCode`}
          className="seeds-grid-span-3"
          label={t("application.contact.zip")}
          testId={`${addressName}.zipCode`}
        >
          {getDetailFieldString(address?.zipCode)}
        </FieldValue>
      </Grid.Row>
    </>
  )
}
