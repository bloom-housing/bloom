import React, { useState } from "react"
import {
  EnumApplicationMethodType,
  ListingDto,
  ApplicationMethodDto,
  EnumApplicationMethodDtoType,
} from "@bloom-housing/core"
import moment from "moment"
import { t } from "../../../helpers/translator"
import { lRoute } from "../../../helpers/localeRoute"
import { Button } from "../../../actions/Button"
import { LinkButton } from "../../../actions/LinkButton"
import { SidebarAddress } from "./SidebarAddress"
import { openDateState } from "../../../helpers/state"

export interface ApplyProps {
  listing: ListingDto
  internalFormRoute: string
}

const hasMethod = (
  applicationMethods: ApplicationMethodDto[],
  type: EnumApplicationMethodDtoType
) => {
  return applicationMethods.some((method) => method.type == type)
}

const hasAnyMethods = (
  applicationMethods: ApplicationMethodDto[],
  types: EnumApplicationMethodDtoType[]
) => {
  return applicationMethods.some((method) => types.some((type) => type == method.type))
}

const getMethod = (
  applicationMethods: ApplicationMethodDto[],
  type: EnumApplicationMethodDtoType
) => {
  return applicationMethods.find((method) => method.type == type)
}

const OrDivider = (props: { bgColor: string }) => (
  <div className="aside-block__divider">
    <span className={`bg-${props.bgColor} aside-block__conjunction`}>or</span>
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
  const { listing, internalFormRoute } = props
  let onlineApplicationUrl = ""

  const [showDownload, setShowDownload] = useState(false)
  const toggleDownload = () => setShowDownload(!showDownload)

  const openDate = moment(listing.applicationOpenDate).format("MMMM D, YYYY")

  if (hasMethod(listing.applicationMethods, EnumApplicationMethodDtoType.Internal)) {
    onlineApplicationUrl = lRoute(`${internalFormRoute}?listingId=${listing.id}`)
  } else if (hasMethod(listing.applicationMethods, EnumApplicationMethodDtoType.ExternalLink)) {
    onlineApplicationUrl =
      getMethod(listing.applicationMethods, EnumApplicationMethodDtoType.ExternalLink)
        ?.externalReference || ""
  }

  const downloadMethods = listing.applicationMethods.filter((method: ApplicationMethodDto) => {
    return method.type == EnumApplicationMethodDtoType.FileDownload
  })

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
            <LinkButton filled className="w-full mb-2" href={onlineApplicationUrl}>
              {t("listings.apply.applyOnline")}
            </LinkButton>
          </>
        )}
        {!openDateState(listing) && downloadMethods.length > 0 && (
          <>
            {onlineApplicationUrl !== "" && <OrDivider bgColor="white" />}
            <NumberedHeader num={1} text={t("listings.apply.getAPaperApplication")} />
            <Button
              filled={onlineApplicationUrl === ""}
              className="w-full mb-2"
              onClick={toggleDownload}
            >
              {t("listings.apply.downloadApplication")}
            </Button>
          </>
        )}

        {showDownload &&
          downloadMethods.map((method: ApplicationMethodDto) => (
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

        {hasMethod(listing.applicationMethods, EnumApplicationMethodDtoType.PaperPickup) && (
          <>
            {!openDateState(listing) &&
              (onlineApplicationUrl !== "" || downloadMethods.length > 0) && (
                <OrDivider bgColor="white" />
              )}
            <SubHeader text={t("listings.apply.pickUpAnApplication")} />
            <SidebarAddress
              address={listing.leasingAgentAddress}
              officeHours={
                listing.leasingAgentOfficeHours
              }
            />
          </>
        )}
      </section>

      {hasAnyMethods(listing.applicationMethods, [
        EnumApplicationMethodDtoType.POBox,
        EnumApplicationMethodDtoType.LeasingAgent,
      ]) && (
        <section className="aside-block bg-gray-100">
          <NumberedHeader num={2} text={t("listings.apply.submitAPaperApplication")} />
          {hasMethod(listing.applicationMethods, EnumApplicationMethodDtoType.POBox) && (
            <>
              <SubHeader text={t("listings.apply.sendByUsMail")} />
              <p className="text-gray-700">{listing.applicationOrganization}</p>
              <SidebarAddress address={listing.applicationAddress} />
              <p className="mt-4 text-tiny text-gray-750">
                {getMethod(listing.applicationMethods, EnumApplicationMethodDtoType.POBox)
                  ?.acceptsPostmarkedApplications
                  ? t("listings.apply.postmarkedApplicationsMustBeReceivedByDate", {
                      applicationDueDate: moment(listing.applicationDueDate).format("MMM DD, YYYY"),
                      postmarkReceivedByDate: moment(
                        listing.postmarkedApplicationsReceivedByDate
                      ).format("MMM DD, YYYY"),
                      developer: listing.developer,
                    })
                  : t("listings.apply.applicationsMustBeReceivedByDeadline")}
              </p>
            </>
          )}
          {hasMethod(listing.applicationMethods, EnumApplicationMethodDtoType.POBox) &&
            hasMethod(listing.applicationMethods, EnumApplicationMethodDtoType.LeasingAgent) && (
              <OrDivider bgColor="gray-100" />
            )}
          {hasMethod(listing.applicationMethods, EnumApplicationMethodDtoType.LeasingAgent) && (
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

export { Apply as default, Apply }
