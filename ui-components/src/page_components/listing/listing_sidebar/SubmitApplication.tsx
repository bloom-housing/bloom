import * as React from "react"
import { t } from "../../../helpers/translator"
import { Address } from "../../../helpers/address"
import { SidebarAddress } from "./SidebarAddress"
import { OrDivider } from "./OrDivider"
import { ListingStatus } from "@bloom-housing/backend-core/types"

export interface PostmarkedApplication {
  postmarkedApplicationsReceivedByDate: string | null
  developer: string
  applicationsDueDate: string | null
}

export interface ApplicationAddressesProps {
  applicationMailingAddress?: Address
  applicationDropOffAddress?: Address
  applicationDropOffAddressOfficeHours?: string
  applicationOrganization?: string
  postmarkedApplicationData?: PostmarkedApplication
  listingStatus?: ListingStatus
}

const SubmitApplication = (props: ApplicationAddressesProps) => {
  if (
    props.listingStatus === ListingStatus.closed ||
    !(props.applicationMailingAddress || props.applicationDropOffAddress)
  ) {
    return null
  }

  const getPostmarkString = () => {
    const applicationDueDate = props.postmarkedApplicationData?.applicationsDueDate
    const postmarkReceivedByDate =
      props.postmarkedApplicationData?.postmarkedApplicationsReceivedByDate
    const developer = props.postmarkedApplicationData?.developer
    if (applicationDueDate) {
      return postmarkReceivedByDate
        ? t("listings.apply.submitPaperDueDatePostMark", {
            applicationDueDate,
            postmarkReceivedByDate,
            developer,
          })
        : t("listings.apply.submitPaperDueDateNoPostMark", {
            applicationDueDate,
            developer,
          })
    } else {
      return postmarkReceivedByDate
        ? t("listings.apply.submitPaperNoDueDatePostMark", { postmarkReceivedByDate, developer })
        : t("listings.apply.submitPaperNoDueDateNoPostMark", { developer })
    }
  }

  return (
    <>
      <section className="aside-block is-tinted bg-gray-100">
        <div className="text-serif-lg">{t("listings.apply.submitAPaperApplication")}</div>
        {props.applicationMailingAddress && (
          <>
            <h3 className="text-caps-tiny">{t("listings.apply.sendByUsMail")}</h3>
            <>
              <p className="text-gray-700">{props.applicationOrganization}</p>
              <SidebarAddress address={props.applicationMailingAddress} />
            </>
            <p className="mt-4 text-tiny text-gray-750">{getPostmarkString()}</p>
          </>
        )}
        {props.applicationDropOffAddress && (
          <>
            {props.applicationMailingAddress && <OrDivider bgColor="gray-100" />}
            <h3 className="text-caps-tiny">{t("listings.apply.dropOffApplication")}</h3>
            <SidebarAddress
              address={props.applicationDropOffAddress}
              officeHours={props.applicationDropOffAddressOfficeHours}
            />
          </>
        )}
      </section>
    </>
  )
}

export { SubmitApplication as default, SubmitApplication }
