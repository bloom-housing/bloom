import { Address } from "helpers/address"
import * as React from "react"
import { t } from "../../../helpers/translator"
import { SidebarAddress } from "./SidebarAddress"
import { NumberedHeader } from "./NumberedHeader"
import { OrDivider } from "./OrDivider"

export interface ApplicationAddressesProps {
  applicationMailingAddress: Address
  applicationDropOffAddress: Address
  applicationDropOffAddressOfficeHours: string
  applicationOrganization: string
  postmarkedApplicationsReceivedByDate: string
  developer: string
  applicationsDueDate: string
}

const ApplicationAddresses = (props: ApplicationAddressesProps) => {
  return (
    <>
      {(props.applicationMailingAddress || props.applicationDropOffAddress) && (
        <section className="aside-block is-tinted bg-gray-100">
          <NumberedHeader num={2} text={t("listings.apply.submitAPaperApplication")} />
          {props.applicationMailingAddress && (
            <>
              <h3 className="text-caps-tiny">{t("listings.apply.sendByUsMail")}</h3>
              <p className="text-gray-700">{props.applicationOrganization}</p>
              <SidebarAddress address={props.applicationMailingAddress} />
              <p className="mt-4 text-tiny text-gray-750">
                {props.postmarkedApplicationsReceivedByDate
                  ? t("listings.apply.postmarkedApplicationsMustBeReceivedByDate", {
                      applicationDueDate: props.applicationsDueDate,
                      postmarkReceivedByDate: props.postmarkedApplicationsReceivedByDate,
                      developer: props.developer,
                    })
                  : t("listings.apply.applicationsMustBeReceivedByDeadline")}
              </p>
            </>
          )}
          {props.applicationMailingAddress && props.applicationDropOffAddress && (
            <OrDivider bgColor="gray-100" />
          )}
          {props.applicationDropOffAddress && (
            <>
              <h3 className="text-caps-tiny">{t("listings.apply.dropOffApplication")}</h3>
              <SidebarAddress
                address={props.applicationDropOffAddress}
                officeHours={props.applicationDropOffAddressOfficeHours}
              />
            </>
          )}
        </section>
      )}
    </>
  )
}

export { ApplicationAddresses as default, ApplicationAddresses }
