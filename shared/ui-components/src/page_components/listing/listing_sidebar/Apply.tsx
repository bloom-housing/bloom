import React, { useState } from "react"
import { Listing, Attachment, AttachmentType } from "@bloom-housing/core/src/listings"
import moment from "moment"
import t from "../../../helpers/translator"
import Button from "../../../atoms/Button"
import LinkButton from "../../../atoms/LinkButton"
import SidebarAddress from "./SidebarAddress"

interface ApplyProps {
  listing: Listing
}

const OrDivider = (props: { bgColor: string }) => (
  <div className="-mx-5 mt-6 mb-2 border-t border-gray-400 text-center">
    <span
      className={`bg-${props.bgColor} relative -top px-1 uppercase text-blue-700 font-semibold`}
    >
      or
    </span>
  </div>
)

const SubHeader = (props: { text: string }) => <h3 className="text-caps-tiny">{props.text}</h3>

const NumberedHeader = (props: { num: number; text: string }) => (
  <div className="text-serif-lg">
    <span className="text-primary pr-1">{props.num}</span>
    {props.text}
  </div>
)

const Apply = (props: ApplyProps) => {
  const { listing } = props
  let onlineApplicationUrl = ""

  const [showDownload, setShowDownload] = useState(false)
  const toggleDownload = () => setShowDownload(!showDownload)

  if (listing.acceptingOnlineApplications) {
    const onlineApplicationAttachment = listing.attachments.filter((attachment: Attachment) => {
      return attachment.type == AttachmentType.ExternalApplication
    })[0]
    if (onlineApplicationAttachment) {
      onlineApplicationUrl = onlineApplicationAttachment.fileUrl
    }
  }

  return (
    <>
      <section className="border border-gray-400 border-b-0 p-5">
        <h2 className="font-alt-sans uppercase text-tiny mb-5 pb-2 border-0 border-b-4 border-primary font-semibold text-gray-800 tracking-widest inline-block">
          {t("listings.apply.howToApply")}
        </h2>

        {listing.acceptingOnlineApplications && (
          <>
            <LinkButton filled className="w-full mb-2" href={onlineApplicationUrl}>
              {t("listings.apply.applyOnline")}
            </LinkButton>
          </>
        )}
        {!listing.acceptingOnlineApplications && (
          <>
            <NumberedHeader num={1} text={t("listings.apply.getAPaperApplication")} />
            <Button filled className="w-full mb-2" onClick={toggleDownload}>
              {t("listings.apply.downloadApplication")}
            </Button>
          </>
        )}

        {showDownload &&
          listing.attachments
            .filter((attachment: Attachment) => {
              return attachment.type == AttachmentType.ApplicationDownload
            })
            .map((attachment: Attachment) => (
              <p key={attachment.fileUrl} className="text-center mt-2 mb-4 text-sm">
                <a
                  href={attachment.fileUrl}
                  title={t("listings.apply.downloadApplication")}
                  target="_blank"
                >
                  {attachment.label}
                </a>
              </p>
            ))}

        {listing.blankPaperApplicationCanBePickedUp && (
          <>
            <OrDivider bgColor="white" />
            <SubHeader text={t("listings.apply.pickUpAnApplication")} />
            <SidebarAddress
              address={listing.leasingAgentAddress}
              officeHours={listing.leasingAgentOfficeHours}
            />
          </>
        )}
      </section>

      {(listing.acceptingApplicationsByPoBox || listing.acceptingApplicationsAtLeasingAgent) && (
        <section className="border-gray-400 border-b border-t p-5 bg-gray-100">
          <NumberedHeader num={2} text={t("listings.apply.submitAPaperApplication")} />
          {listing.acceptingApplicationsByPoBox && (
            <>
              <SubHeader text={t("listings.apply.sendByUsMail")} />
              <p className="text-gray-700">{listing.applicationOrganization}</p>
              <SidebarAddress address={listing.applicationAddress} />
              <p className="mt-4 text-tiny text-gray-750">
                {listing.acceptsPostmarkedApplications
                  ? t("listings.apply.postmarkedApplicationsMustBeReceivedByDate", {
                      applicationDueDate: moment(listing.applicationDueDate).format("MMM DD, YYYY"),
                      postmarkReceivedByDate: moment(
                        listing.postmarkedApplicationsReceivedByDate
                      ).format("MMM DD, YYYY"),
                      developer: listing.developer
                    })
                  : t("listings.apply.applicationsMustBeReceivedByDeadline")}
              </p>
            </>
          )}
          {listing.acceptingApplicationsByPoBox && listing.acceptingApplicationsAtLeasingAgent && (
            <OrDivider bgColor="gray-100" />
          )}
          {listing.acceptingApplicationsAtLeasingAgent && (
            <>
              <SubHeader text={t("listings.apply.dropOffApplication")} />
              <SidebarAddress
                address={listing.leasingAgentAddress}
                officeHours={listing.leasingAgentOfficeHours}
              />
            </>
          )}
        </section>
      )}
    </>
  )
}

export default Apply
