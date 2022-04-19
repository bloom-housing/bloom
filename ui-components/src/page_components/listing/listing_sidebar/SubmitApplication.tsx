import * as React from "react"
import { t } from "../../../helpers/translator"
import { Address } from "../../../page_components/listing/listing_sidebar/MultiLineAddress"
import { ContactAddress } from "./ContactAddress"
import { OrDivider } from "./OrDivider"
import { ListingStatus } from "@bloom-housing/backend-core/types"
import Heading from "../../../headers/Heading"

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
            <Heading priority={3} style={"sidebarSubHeader"}>
              {t("listings.apply.sendByUsMail")}
            </Heading>
            <>
              <p className="text-gray-700">{props.applicationOrganization}</p>
              <ContactAddress address={props.applicationMailingAddress} />
            </>
            <p className="mt-4 text-tiny text-gray-750">{getPostmarkString()}</p>
          </>
        )}
        {props.applicationDropOffAddress && (
          <>
            {props.applicationMailingAddress && <OrDivider bgColor="gray-100" />}
            <Heading priority={3} style={"sidebarSubHeader"}>
              {t("listings.apply.dropOffApplication")}
            </Heading>
            <ContactAddress address={props.applicationDropOffAddress} />
            <Heading priority={3} style={"sidebarSubHeader"}>
              {props.applicationDropOffAddressOfficeHours}
            </Heading>
          </>
        )}
      </section>
    </>
  )
}

export { SubmitApplication as default, SubmitApplication }
