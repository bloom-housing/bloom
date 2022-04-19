import React, { useState } from "react"
import { t } from "../../../helpers/translator"
import { Button } from "../../../actions/Button"
import { LinkButton } from "../../../actions/LinkButton"
import { AppearanceStyleType } from "../../../global/AppearanceTypes"
import { Address } from "../../../page_components/listing/listing_sidebar/MultiLineAddress"
import { ContactAddress } from "./ContactAddress"
import { OrDivider } from "./OrDivider"
import { ListingStatus } from "@bloom-housing/backend-core/types"
import Heading from "../../../headers/Heading"

export interface PaperApplication {
  fileURL: string
  languageString: string
}

export interface ApplicationsProps {
  onlineApplicationURL?: string
  applicationsOpen: boolean
  applicationsOpenDate?: string
  paperApplications?: PaperApplication[]
  paperMethod?: boolean
  postmarkedApplicationsReceivedByDate?: string
  applicationPickUpAddressOfficeHours?: string
  applicationPickUpAddress?: Address
  preview?: boolean
  listingStatus?: ListingStatus
}

const GetApplication = (props: ApplicationsProps) => {
  const [showDownload, setShowDownload] = useState(false)
  const toggleDownload = () => setShowDownload(!showDownload)

  if (props.listingStatus === ListingStatus.closed) {
    return null
  }

  return (
    <section className="aside-block">
      <h2 className="text-caps-underline">{t("listings.apply.howToApply")}</h2>
      {!props.applicationsOpen && (
        <p className="mb-5 text-gray-700">
          {t("listings.apply.applicationWillBeAvailableOn", {
            openDate: props.applicationsOpenDate,
          })}
        </p>
      )}
      {props.applicationsOpen && props.onlineApplicationURL && (
        <>
          {props.preview ? (
            <Button disabled className="w-full mb-2" data-test-id={"listing-view-apply-button"}>
              {t("listings.apply.applyOnline")}
            </Button>
          ) : (
            <LinkButton
              styleType={AppearanceStyleType.primary}
              className="w-full mb-2"
              href={props.onlineApplicationURL}
              dataTestId={"listing-view-apply-button"}
            >
              {t("listings.apply.applyOnline")}
            </LinkButton>
          )}
        </>
      )}
      {props.applicationsOpen && props.paperMethod && (
        <>
          {props.onlineApplicationURL && <OrDivider bgColor="white" />}
          <div className="text-serif-lg">{t("listings.apply.getAPaperApplication")}</div>
          <Button
            styleType={
              !props.preview && props.onlineApplicationURL ? AppearanceStyleType.primary : undefined
            }
            className="w-full mb-2"
            onClick={toggleDownload}
            disabled={props.preview}
          >
            {t("listings.apply.downloadApplication")}
          </Button>
        </>
      )}
      {showDownload &&
        props.paperApplications?.map((paperApplication: PaperApplication, index: number) => (
          <p key={index} className="text-center mt-2 mb-4 text-sm">
            <a
              href={paperApplication.fileURL}
              title={t("listings.apply.downloadApplication")}
              target="_blank"
            >
              {paperApplication.languageString}
            </a>
          </p>
        ))}
      {props.applicationPickUpAddress && (
        <>
          {props.applicationsOpen && (props.onlineApplicationURL || props.paperMethod) && (
            <OrDivider bgColor="white" />
          )}
          <Heading priority={3} style={"sidebarSubHeader"}>
            {t("listings.apply.pickUpAnApplication")}
          </Heading>
          <ContactAddress address={props.applicationPickUpAddress} />
          <Heading priority={3} style={"sidebarSubHeader"}>
            {props.applicationPickUpAddressOfficeHours}
          </Heading>
        </>
      )}
    </section>
  )
}

export { GetApplication as default, GetApplication }
