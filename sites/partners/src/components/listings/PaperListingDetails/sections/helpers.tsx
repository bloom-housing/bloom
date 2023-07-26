import React from "react"
import { AddressUpdate } from "@bloom-housing/backend-core/types"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
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
  address: AddressUpdate,
  addressName: AddressType,
  subtitle: string
) => {
  if (!address) {
    return (
      <FieldValue>
        <GridSection subtitle={subtitle}>{getDetailFieldString(null)}</GridSection>
      </FieldValue>
    )
  }
  return (
    <>
      <GridSection subtitle={subtitle} columns={6}>
        <GridCell span={3}>
          <FieldValue
            id={`${addressName}.street`}
            label={t("listings.streetAddressOrPOBox")}
            testId={`${addressName}.street`}
          >
            {getDetailFieldString(address?.street)}
          </FieldValue>
        </GridCell>
        <GridCell span={3}>
          <FieldValue
            id={`${addressName}.street2`}
            label={t("application.contact.apt")}
            testId={`${addressName}.street2`}
          >
            {getDetailFieldString(address?.street2)}
          </FieldValue>
        </GridCell>
      </GridSection>
      <GridSection columns={6}>
        <GridCell span={2}>
          <FieldValue
            id={`${addressName}.city`}
            label={t("application.contact.city")}
            testId={`${addressName}.city`}
          >
            {getDetailFieldString(address?.city)}
          </FieldValue>
        </GridCell>
        <FieldValue
          id={`${addressName}.state`}
          label={t("application.contact.state")}
          testId={`${addressName}.state`}
        >
          {getDetailFieldString(address?.state)}
        </FieldValue>
        <FieldValue
          id={`${addressName}.zipCode`}
          label={t("application.contact.zip")}
          testId={`${addressName}.zipCode`}
        >
          {getDetailFieldString(address?.zipCode)}
        </FieldValue>
      </GridSection>
    </>
  )
}
