import React from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import {
  AddressCreate,
  Application,
  HouseholdMember,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

type DetailsAddressColumnsProps = {
  type: AddressColsType
  application?: Application
  addressObject?: AddressCreate
  householdMember?: HouseholdMember
  small?: boolean
  dataTestId?: string
}

export enum AddressColsType {
  "residence" = "residence",
  "mailing" = "mailing",
  "work" = "work",
  "alternateAddress" = "alternateAddress",
  "memberResidence" = "memberResidence",
  "memberWork" = "memberWork",
  "preferences" = "preferences",
}

const DetailsAddressColumns = ({
  type,
  application,
  addressObject,
  householdMember,
  small,
  dataTestId,
}: DetailsAddressColumnsProps) => {
  const address = {
    city: "",
    state: "",
    street: "",
    street2: "",
    zipCode: "",
  }

  Object.keys(address).forEach((item) => {
    if (type === AddressColsType.residence) {
      address[item] = application.applicant.applicantAddress[item] || t("t.n/a")
    }

    if (type === AddressColsType.mailing) {
      if (application.sendMailToMailingAddress) {
        address[item] = application.applicationsMailingAddress[item]
      } else {
        address[item] = application.applicant.applicantAddress[item] || t("t.n/a")
      }
    }

    if (type === AddressColsType.alternateAddress) {
      address[item] =
        application.alternateContact && application.alternateContact.address[item]
          ? application.alternateContact.address[item]
          : t("t.n/a")
    }

    if (type === AddressColsType.memberResidence) {
      if (householdMember?.sameAddress === "yes") {
        address[item] = application.applicant.applicantAddress[item]
          ? application.applicant.applicantAddress[item]
          : t("t.n/a")
      } else {
        address[item] = householdMember?.householdMemberAddress[item]
          ? householdMember.householdMemberAddress[item]
          : t("t.n/a")
      }
    }

    if (type === AddressColsType.preferences && addressObject) {
      address[item] = addressObject[item] ? addressObject[item] : t("t.n/a")
    }
  })

  return (
    <>
      <FieldValue
        className={small && "seeds-grid-span-3"}
        label={t("application.contact.streetAddress")}
        testId={`${dataTestId}.streetAddress`}
      >
        {address.street}
      </FieldValue>

      <FieldValue
        className={small ? "seeds-grid-span-3" : "seeds-grid-span-2"}
        label={t("application.contact.apt")}
        testId={`${dataTestId}.street2`}
      >
        {address.street2}
      </FieldValue>

      <FieldValue
        className={small && "seeds-grid-span-2"}
        label={t("application.contact.city")}
        testId={`${dataTestId}.city`}
      >
        {address.city}
      </FieldValue>

      <FieldValue label={t("application.contact.state")} testId={`${dataTestId}.state`}>
        {address.state}
      </FieldValue>

      <FieldValue
        className={small && "seeds-grid-span-3"}
        label={t("application.contact.zip")}
        testId={`${dataTestId}.zipCode`}
      >
        {address.zipCode}
      </FieldValue>
    </>
  )
}

export { DetailsAddressColumns as default, DetailsAddressColumns }
