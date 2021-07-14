import { t, GridCell, ViewItem } from "@bloom-housing/ui-components"
import {
  Application,
  HouseholdMemberUpdate,
  AddressCreate,
} from "@bloom-housing/backend-core/types"
import { YesNoAnswer } from "../PaperApplicationForm/FormTypes"

type DetailsAddressColumnsProps = {
  type: AddressColsType
  application?: Application
  addressObject?: AddressCreate
  householdMember?: HouseholdMemberUpdate
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
      address[item] = application.applicant.address[item] || t("t.n/a")
    }

    if (type === AddressColsType.mailing) {
      if (application.sendMailToMailingAddress) {
        address[item] = application.mailingAddress[item]
      } else {
        address[item] = application.applicant.address[item] || t("t.n/a")
      }
    }

    if (type === AddressColsType.work) {
      if (application.applicant.workInRegion === YesNoAnswer.Yes) {
        address[item] = application.applicant.workAddress[item] || t("t.n/a")
      } else {
        address[item] = t("t.n/a")
      }
    }

    if (type === AddressColsType.alternateAddress) {
      address[item] = application.alternateContact.mailingAddress[item]
        ? application.alternateContact.mailingAddress[item]
        : t("t.n/a")
    }

    if (type === AddressColsType.memberWork) {
      address[item] = householdMember?.workAddress[item]
        ? householdMember?.workAddress[item]
        : t("t.n/a")
    }

    if (type === AddressColsType.memberResidence) {
      if (householdMember?.sameAddress === "yes") {
        address[item] = application.applicant.address[item]
          ? application.applicant.address[item]
          : t("t.n/a")
      } else {
        address[item] = householdMember?.address[item] ? householdMember?.address[item] : t("t.n/a")
      }
    }

    if (type === AddressColsType.preferences && addressObject) {
      address[item] = addressObject[item] ? addressObject[item] : t("t.n/a")
    }
  })

  return (
    <>
      <GridCell>
        <ViewItem label={t("application.contact.streetAddress")}>{address.street}</ViewItem>
      </GridCell>

      <GridCell span={2}>
        <ViewItem label={t("application.contact.apt")}>{address.street2}</ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("application.contact.city")}>{address.city}</ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("application.contact.state")}>{address.state}</ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("application.contact.zip")}>{address.zipCode}</ViewItem>
      </GridCell>
    </>
  )
}

export { DetailsAddressColumns as default, DetailsAddressColumns }
