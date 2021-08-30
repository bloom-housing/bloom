import React, { useState } from "react"
import {
  Listing,
  ApplicationMethod,
  ApplicationMethodType,
  ListingApplicationAddressType,
} from "@bloom-housing/backend-core/types"
import moment from "moment"
import { t } from "../../../helpers/translator"
import { Button } from "../../../actions/Button"
import { LinkButton } from "../../../actions/LinkButton"
import { SidebarAddress } from "./SidebarAddress"
import { openDateState } from "../../../helpers/state"
import { AppearanceStyleType } from "../../../global/AppearanceTypes"
import { Icon, IconFillColors } from "../../../icons/Icon"

export interface ApplyProps {
  listing: Listing
  internalFormRoute: string
  preview?: boolean
}

const hasMethod = (applicationMethods: ApplicationMethod[], type: ApplicationMethodType) => {
  return applicationMethods.some((method) => method.type == type)
}

const getMethod = (applicationMethods: ApplicationMethod[], type: ApplicationMethodType) => {
  return applicationMethods.find((method) => method.type == type)
}

const OrDivider = (props: { bgColor: string }) => (
  <div className="aside-block__divider">
    <span className={`bg-${props.bgColor} aside-block__conjunction`}>{t("t.or")}</span>
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
  // /applications/start/choose-language
  const { listing, internalFormRoute, preview } = props
  let onlineApplicationUrl = ""

  const [showDownload, setShowDownload] = useState(false)
  const toggleDownload = () => setShowDownload(!showDownload)

  const openDate = moment(listing.applicationOpenDate).format("MMMM D, YYYY")

  if (hasMethod(listing.applicationMethods, ApplicationMethodType.Internal)) {
    onlineApplicationUrl = `${internalFormRoute}?listingId=${listing.id}`
  } else if (hasMethod(listing.applicationMethods, ApplicationMethodType.ExternalLink)) {
    onlineApplicationUrl =
      getMethod(listing.applicationMethods, ApplicationMethodType.ExternalLink)
        ?.externalReference || ""
  }

  const downloadMethods = listing.applicationMethods.filter((method: ApplicationMethod) => {
    return method.type == ApplicationMethodType.FileDownload
  })

  type AddressLocation = "dropOff" | "pickUp"

  const getAddress = (
    addressType: ListingApplicationAddressType | undefined,
    location: AddressLocation
  ) => {
    if (addressType === ListingApplicationAddressType.leasingAgent) {
      return listing.leasingAgentAddress
    }
    if (addressType === ListingApplicationAddressType.mailingAddress) {
      return listing.applicationMailingAddress
    }
    if (location === "dropOff") {
      return listing.applicationDropOffAddress
    } else {
      return listing.applicationPickUpAddress
    }
  }

  const phoneNumber = listing.leasingAgentPhone
    ? `tel:${listing.leasingAgentPhone.replace(/[-()]/g, "")}`
    : ""

  return (
    <>
      <section className="aside-block">
        <h2 className="text-caps-underline">{t("listings.apply.howToApply")}</h2>
        {openDateState(listing) && (
          <p className="mb-5 text-gray-700">
            {t("listings.apply.applicationWillBeAvailableOn", { openDate: openDate })}
          </p>
        )}
        {!openDateState(listing) && onlineApplicationUrl !== "" && (
          <>
            {preview ? (
              <Button disabled className="w-full mb-2">
                {t("listings.apply.applyOnline")}
              </Button>
            ) : (
              <LinkButton
                styleType={AppearanceStyleType.primary}
                className="w-full mb-2"
                href={onlineApplicationUrl}
              >
                {t("listings.apply.applyOnline")}
              </LinkButton>
            )}
          </>
        )}
        {!openDateState(listing) && downloadMethods.length > 0 && (
          <>
            {onlineApplicationUrl !== "" && <OrDivider bgColor="white" />}
            <NumberedHeader num={1} text={t("listings.apply.getAPaperApplication")} />
            <Button
              styleType={
                !preview && onlineApplicationUrl === "" ? AppearanceStyleType.primary : undefined
              }
              className="w-full mb-2"
              onClick={toggleDownload}
              disabled={preview}
            >
              {t("listings.apply.downloadApplication")}
            </Button>
          </>
        )}
        {showDownload &&
          downloadMethods.map((method: ApplicationMethod) => (
            <p key={method.externalReference} className="text-center mt-2 mb-4 text-sm">
              <a
                href={method.externalReference}
                title={t("listings.apply.downloadApplication")}
                target="_blank"
              >
                {method.label}
              </a>
            </p>
          ))}
        {(listing.applicationPickUpAddress ||
          listing.applicationPickUpAddressType ||
          listing.applicationAddress) && (
          <>
            {!openDateState(listing) &&
              (onlineApplicationUrl !== "" || downloadMethods.length > 0) && (
                <OrDivider bgColor="white" />
              )}
            <SubHeader text={t("listings.apply.pickUpAnApplication")} />
            <SidebarAddress
              address={
                getAddress(listing.applicationPickUpAddressType, "pickUp") ||
                listing.applicationAddress
              }
              officeHours={listing.applicationPickUpAddressOfficeHours}
            />
          </>
        )}
        {!listing.applicationAddress && !listing.applicationPickUpAddress && (
          <>
            {!openDateState(listing) &&
              (onlineApplicationUrl !== "" || downloadMethods.length > 0) && (
                <OrDivider bgColor="white" />
              )}
            <SubHeader text={t("listings.apply.contactManagment")} />
            <p className="mt-5">
              <a href={phoneNumber}>
                <Icon symbol="phone" size="medium" fill={IconFillColors.primary} /> {t("t.call")}{" "}
                {listing.leasingAgentPhone}
              </a>
            </p>
          </>
        )}
      </section>

      {(listing.applicationMailingAddress ||
        listing.applicationDropOffAddress ||
        listing.applicationDropOffAddressType) && (
        <section className="aside-block is-tinted bg-gray-100">
          <NumberedHeader num={2} text={t("listings.apply.submitAPaperApplication")} />
          {listing.applicationMailingAddress && (
            <>
              <SubHeader text={t("listings.apply.sendByUsMail")} />
              <p className="text-gray-700">{listing.applicationOrganization}</p>
              <SidebarAddress address={listing.applicationMailingAddress} />
              <p className="mt-4 text-tiny text-gray-750">
                {listing.postmarkedApplicationsReceivedByDate
                  ? t("listings.apply.postmarkedApplicationsMustBeReceivedByDate", {
                      applicationDueDate: moment(listing.applicationDueDate).format(
                        `MMM. DD, YYYY [${t("t.at")}] h A`
                      ),
                      postmarkReceivedByDate: moment(
                        listing.postmarkedApplicationsReceivedByDate
                      ).format(`MMM. DD, YYYY [${t("t.at")}] h A`),
                      developer: listing.developer,
                    })
                  : t("listings.apply.applicationsMustBeReceivedByDeadline")}
              </p>
            </>
          )}
          {listing.applicationMailingAddress && listing.applicationDropOffAddress && (
            <OrDivider bgColor="gray-100" />
          )}
          {(listing.applicationDropOffAddress || listing.applicationDropOffAddressType) && (
            <>
              <SubHeader text={t("listings.apply.dropOffApplication")} />
              <SidebarAddress
                address={getAddress(listing.applicationDropOffAddressType, "dropOff")}
                officeHours={listing.applicationDropOffAddressOfficeHours}
              />
            </>
          )}
        </section>
      )}
    </>
  )
}

export { Apply as default, Apply }
