import * as React from "react"
import { t } from "../../../helpers/translator"
import { Address } from "../../../helpers/address"
import { SidebarAddress } from "./SidebarAddress"
import { NumberedHeader } from "./NumberedHeader"
import { OrDivider } from "./OrDivider"

export interface PostmarkedApplication {
  postmarkedApplicationsReceivedByDate: string
  developer: string
  applicationsDueDate: string
}

export interface ApplicationAddressesProps {
  applicationMailingAddress?: Address
  applicationDropOffAddress?: Address
  applicationDropOffAddressOfficeHours?: string
  applicationOrganization?: string
  postmarkedApplicationData?: PostmarkedApplication
}

const SubmitApplication = (props: ApplicationAddressesProps) => {
  console.log(props.postmarkedApplicationData?.postmarkedApplicationsReceivedByDate)
  return (
    <>
      {(props.applicationMailingAddress ||
        props.applicationDropOffAddress ||
        props.postmarkedApplicationData) && (
        <section className="aside-block is-tinted bg-gray-100">
          <NumberedHeader num={2} text={t("listings.apply.submitAPaperApplication")} />
          {(props.applicationMailingAddress || props.postmarkedApplicationData) && (
            <>
              <h3 className="text-caps-tiny">{t("listings.apply.sendByUsMail")}</h3>
              <p className="text-gray-700">{props.applicationOrganization}</p>
              {props.applicationMailingAddress && (
                <SidebarAddress address={props.applicationMailingAddress} />
              )}
              <p className="mt-4 text-tiny text-gray-750">
                {props.postmarkedApplicationData?.postmarkedApplicationsReceivedByDate
                  ? t("listings.apply.postmarkedApplicationsMustBeReceivedByDate", {
                      applicationDueDate: props.postmarkedApplicationData?.applicationsDueDate,
                      postmarkReceivedByDate:
                        props.postmarkedApplicationData?.postmarkedApplicationsReceivedByDate,
                      developer: props.postmarkedApplicationData?.developer,
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

export { SubmitApplication as default, SubmitApplication }
