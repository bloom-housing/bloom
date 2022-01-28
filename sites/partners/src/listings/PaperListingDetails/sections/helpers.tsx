import React from "react"
import { AddressUpdate } from "@bloom-housing/backend-core/types"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import dayjs from "dayjs"

export const getDetailFieldNumber = (listingNumber: number) => {
  return listingNumber ? listingNumber.toString() : t("t.none")
}

export const getDetailFieldString = (listingString: string) => {
  return listingString && listingString !== "" ? listingString : t("t.none")
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

export const getReadableErrorMessage = (errorMessage: string | undefined) => {
  const errorDetails = errorMessage.substr(errorMessage.indexOf(" ") + 1)
  let readableMessage = null
  switch (errorDetails) {
    case "should not be null or undefined":
    case "must be a string":
    case "must be an UUID":
    case "must contain at least 1 elements":
    case "must be a boolean value":
      readableMessage = t("errors.requiredFieldError")
      break
    case "must be an email":
      readableMessage = t("errors.emailAddressError")
      break
    case "must be a valid phone number":
      readableMessage = t("errors.phoneNumberError")
  }
  return readableMessage
}

type AddressType =
  | "leasingAgentAddress"
  | "applicationMailingAddress"
  | "applicationPickUpAddress"
  | "applicationDropOffAddress"

export const getDetailAddress = (
  address: AddressUpdate,
  addressName: AddressType,
  subtitle: string
) => {
  return (
    <>
      <GridSection subtitle={subtitle} columns={6}>
        <GridCell span={3}>
          <ViewItem id={`${addressName}.street`} label={t("listings.streetAddressOrPOBox")}>
            {address?.street}
          </ViewItem>
        </GridCell>
        <GridCell span={3}>
          <ViewItem id={`${addressName}.street2`} label={t("application.contact.apt")}>
            {address?.street2}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={6}>
        <GridCell span={2}>
          <ViewItem id={`${addressName}.city`} label={t("application.contact.city")}>
            {address?.city}
          </ViewItem>
        </GridCell>
        <ViewItem id={`${addressName}.state`} label={t("application.contact.state")}>
          {address?.state}
        </ViewItem>
        <ViewItem id={`${addressName}.zipCode`} label={t("application.contact.zip")}>
          {address?.zipCode}
        </ViewItem>
      </GridSection>
    </>
  )
}
