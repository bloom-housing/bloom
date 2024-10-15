import React, { useState } from "react"
import Markdown from "markdown-to-jsx"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  Address,
  Heading,
  t,
  OrDivider,
  ContactAddress,
  Form,
  FieldGroup,
} from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { isExternalLink } from "@bloom-housing/ui-seeds/src/global/NavigationContext"
import { useForm } from "react-hook-form"
import { downloadExternalPDF } from "../../lib/helpers"

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
  /** The name of the listing */
  listingName: string
  /** The id of the listing */
  listingId: string
  /** The URL for an online applications */
  onlineApplicationURL?: string
  /** Any number of paper application objects, including their URL and language */
  paperApplications?: PaperApplication[]
  /** Whether or not there is a paper application method */
  paperMethod?: boolean
  /** The date mailed applications must be received by */
  postmarkedApplicationsReceivedByDate?: string
  /** Informs whether or not to hide actionable application buttons */
  listingStatus?: string
  /** Whether or not to block submission of test application */
  preview?: boolean
  /** Whether or not to show apply online helper text */
  isExternal?: boolean
  strings?: {
    applicationsOpenInFuture?: string
    applyOnline?: string
    applyOnlineMessage?: string
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
  const disableApplyButton = !props.preview && props.listingStatus !== ListingsStatusEnum.active
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = useForm()
  const paperApplicationURL: string = watch(
    "paperApplicationLanguage",
    props.paperApplications?.length ? props.paperApplications[0].fileURL : undefined
  )

  if (!showSection) return null

  return (
    <section className="aside-block" data-testid="get-application-section">
      <Heading priority={2} styleType={"underlineWeighted"}>
        {props.strings?.howToApply ?? t("listings.apply.howToApply")}
      </Heading>

      {!props.applicationsOpen && (
        <p className="mb-5 text-gray-700">
          {props.strings?.applicationsOpenInFuture ??
            t("listings.apply.applicationWillBeAvailableOn", {
              openDate: props.applicationsOpenDate,
            })}
        </p>
      )}
      {props.applicationsOpen && props.onlineApplicationURL && (
        <div style={{ boxSizing: "border-box" }}>
          {disableApplyButton ? (
            <Button
              variant="primary-outlined"
              className="w-full mb-2"
              disabled
              id={"listing-view-apply-button"}
            >
              {props.strings?.applyOnline ?? t("listings.apply.applyOnline")}
            </Button>
          ) : (
            <Button
              variant="primary"
              className="w-full mb-2"
              href={props.onlineApplicationURL}
              id={"listing-view-apply-button"}
              newWindowTarget={isExternalLink(props.onlineApplicationURL)}
            >
              {props.strings?.applyOnline ?? t("listings.apply.applyOnline")}
            </Button>
          )}
          <div className="text-gray-800 text-sm">
            {props.isExternal &&
              (props.strings?.applyOnlineMessage ?? t("listings.apply.applyOnlineMessage"))}
          </div>
        </div>
      )}

      {props.applicationsOpen && props.paperMethod && !!props.paperApplications?.length && (
        <>
          {props.onlineApplicationURL && <OrDivider bgColor="white" />}
          <div className="text-serif-xl mb-6">
            {props.strings?.getAPaperApplication ?? t("listings.apply.getAPaperApplication")}
          </div>
          <Button
            variant="primary"
            className="w-full mb-2"
            onClick={async () => {
              props.paperApplications.length === 1
                ? await downloadExternalPDF(props.paperApplications[0].fileURL, props.listingName)
                : setShowDownloadModal(true)
            }}
          >
            {props.strings?.downloadApplication ?? t("listings.apply.downloadApplication")}
          </Button>
        </>
      )}
      {props.applicationPickUpAddress && (
        <>
          {props.applicationsOpen && (props.onlineApplicationURL || props.paperMethod) && (
            <OrDivider bgColor="white" />
          )}
          <Heading priority={3} styleType={"capsWeighted"}>
            {props.strings?.pickUpApplication ?? t("listings.apply.pickUpAnApplication")}
          </Heading>
          <ContactAddress
            address={props.applicationPickUpAddress}
            mapString={props.strings?.getDirections ?? t("t.getDirections")}
          />
          {props.applicationPickUpAddressOfficeHours && (
            <>
              <Heading priority={3} styleType={"capsWeighted"}>
                {props.strings?.officeHoursHeading ?? t("leasingAgent.officeHours")}
              </Heading>
              <p className="text-gray-800 text-sm markdown">
                <Markdown
                  children={props.applicationPickUpAddressOfficeHours}
                  options={{ disableParsingRawHTML: true }}
                />
              </p>
            </>
          )}
        </>
      )}
      <Dialog
        isOpen={!!showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        ariaLabelledBy="get-application-header"
      >
        <Dialog.Header id="get-application-header">{t("listings.chooseALanguage")}</Dialog.Header>
        <Dialog.Content>
          <Form>
            <fieldset>
              <legend className="sr-only">{t("listings.chooseALanguage")}</legend>
              <FieldGroup
                name="paperApplicationLanguage"
                fieldGroupClassName="grid grid-cols-1"
                fieldClassName="ml-0"
                type="radio"
                register={register}
                validation={{ required: true }}
                fields={props.paperApplications?.map((app, index) => ({
                  id: app.languageString,
                  label: app.languageString,
                  value: app.fileURL,
                  defaultChecked: index === 0,
                }))}
                dataTestId={"paper-application-language"}
              />
            </fieldset>
          </Form>
        </Dialog.Content>
        <Dialog.Footer>
          <Button
            variant="primary"
            size="sm"
            onClick={async () => {
              await downloadExternalPDF(paperApplicationURL, props.listingName)
              setShowDownloadModal(false)
            }}
          >
            {t("t.download")}
          </Button>
          <Button
            variant="primary-outlined"
            size="sm"
            onClick={() => {
              setShowDownloadModal(false)
            }}
          >
            {t("t.cancel")}
          </Button>
        </Dialog.Footer>
      </Dialog>
    </section>
  )
}

export { GetApplication as default, GetApplication }
