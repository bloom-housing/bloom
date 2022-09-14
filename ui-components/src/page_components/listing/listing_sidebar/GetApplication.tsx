import React, { useState } from "react"
import Markdown from "markdown-to-jsx"
import { Button } from "../../../actions/Button"
import { LinkButton } from "../../../actions/LinkButton"
import { AppearanceStyleType } from "../../../global/AppearanceTypes"
import { Address } from "../../../helpers/MultiLineAddress"
import { Heading } from "../../../headers/Heading"
import { t } from "../../../helpers/translator"
import { OrDivider } from "./OrDivider"
import { ContactAddress } from "./ContactAddress"

export interface PaperApplication {
  fileURL: string
  languageString: string
}

export interface ApplicationsProps {
  /** The pickup address for the application */
  applicationPickUpAddress?: Address
  /** Office hours for the agent at the pickup address */
  applicationPickUpAddressOfficeHours?: string
  /** Whether or not applications are currently open */
  applicationsOpen: boolean
  /** The date applications open */
  applicationsOpenDate?: string
  /** The URL for an online applications */
  onlineApplicationURL?: string
  /** Any number of paper application objects, including their URL and language */
  paperApplications?: PaperApplication[]
  /** Whether or not there is a paper application method */
  paperMethod?: boolean
  /** The date mailed applications must be received by */
  postmarkedApplicationsReceivedByDate?: string
  /** Whether or not to hide actionable application buttons */
  preview?: boolean
  strings?: {
    applicationsOpenInFuture?: string
    applyOnline?: string
    downloadApplication?: string
    getAPaperApplication?: string
    getDirections?: string
    howToApply?: string
    officeHoursHeading?: string
    pickUpApplication?: string
  }
}
/** Displays information regarding how to apply, including an online application link button, paper application downloads, and a paper application pickup address */
const GetApplication = (props: ApplicationsProps) => {
  const showSection =
    props.onlineApplicationURL ||
    (props.applicationsOpen && props.paperMethod && !!props.paperApplications?.length)
  const [showDownload, setShowDownload] = useState(false)
  const toggleDownload = () => setShowDownload(!showDownload)

  if (!showSection) return null

  return (
    <section className="aside-block" data-test-id="get-application-section">
      <h2 className="text-caps-underline">
        {props.strings?.howToApply ?? t("listings.apply.howToApply")}
      </h2>
      {!props.applicationsOpen && (
        <p className="mb-5 text-gray-700">
          {props.strings?.applicationsOpenInFuture ??
            t("listings.apply.applicationWillBeAvailableOn", {
              openDate: props.applicationsOpenDate,
            })}
        </p>
      )}
      {props.applicationsOpen && props.onlineApplicationURL && (
        <>
          {props.preview ? (
            <Button disabled className="w-full mb-2" data-test-id={"listing-view-apply-button"}>
              {props.strings?.applyOnline ?? t("listings.apply.applyOnline")}
            </Button>
          ) : (
            <LinkButton
              styleType={AppearanceStyleType.primary}
              className="w-full mb-2"
              href={props.onlineApplicationURL}
              dataTestId={"listing-view-apply-button"}
            >
              {props.strings?.applyOnline ?? t("listings.apply.applyOnline")}
            </LinkButton>
          )}
        </>
      )}

      {props.applicationsOpen && props.paperMethod && !!props.paperApplications?.length && (
        <>
          {props.onlineApplicationURL && <OrDivider bgColor="white" />}
          <div className="text-serif-lg">
            {props.strings?.getAPaperApplication ?? t("listings.apply.getAPaperApplication")}
          </div>
          <Button
            styleType={
              !props.preview && props.onlineApplicationURL ? AppearanceStyleType.primary : undefined
            }
            className="w-full mb-2"
            onClick={toggleDownload}
            disabled={props.preview}
          >
            {props.strings?.downloadApplication ?? t("listings.apply.downloadApplication")}
          </Button>
        </>
      )}
      {showDownload &&
        props.paperApplications?.map((paperApplication: PaperApplication, index: number) => (
          <p key={index} className="text-center mt-2 mb-4 text-sm">
            <a
              href={paperApplication.fileURL}
              title={props.strings?.downloadApplication ?? t("listings.apply.downloadApplication")}
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
            {props.strings?.pickUpApplication ?? t("listings.apply.pickUpAnApplication")}
          </Heading>
          <ContactAddress
            address={props.applicationPickUpAddress}
            mapString={props.strings?.getDirections ?? t("t.getDirections")}
          />
          {props.applicationPickUpAddressOfficeHours && (
            <>
              <Heading priority={3} style={"sidebarSubHeader"}>
                {props.strings?.officeHoursHeading ?? t("leasingAgent.officeHours")}
              </Heading>
              <p className="text-gray-800 text-tiny markdown">
                <Markdown
                  children={props.applicationPickUpAddressOfficeHours}
                  options={{ disableParsingRawHTML: true }}
                />
              </p>
            </>
          )}
        </>
      )}
    </section>
  )
}

export { GetApplication as default, GetApplication }
