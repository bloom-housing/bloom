import React, { useState } from "react"
import Markdown from "markdown-to-jsx"
import { useForm } from "react-hook-form"
import {
  Button,
  LinkButton,
  AppearanceStyleType,
  Address,
  Heading,
  t,
  OrDivider,
  ContactAddress,
  Modal,
  AppearanceSizeType,
  Form,
  FieldGroup,
  setSiteAlertMessage,
} from "@bloom-housing/ui-components"
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
        <>
          {props.preview ? (
            <Button disabled className="w-full mb-2" data-testid={"listing-view-apply-button"}>
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
          <div className="text-serif-xl mb-6">
            {props.strings?.getAPaperApplication ?? t("listings.apply.getAPaperApplication")}
          </div>
          {props.paperApplications.length === 1 ? (
            <Button
              size={AppearanceSizeType.small}
              onClick={async () => {
                await downloadExternalPDF(props.paperApplications[0].fileURL, "Housing Application")
              }}
              styleType={AppearanceStyleType.primary}
            >
              {props.strings?.downloadApplication ?? t("listings.apply.downloadApplication")}
            </Button>
          ) : (
            <Button
              styleType={
                !props.preview && props.onlineApplicationURL
                  ? AppearanceStyleType.primary
                  : undefined
              }
              className="w-full mb-2"
              onClick={() => setShowDownloadModal(true)}
              disabled={props.preview}
            >
              {props.strings?.downloadApplication ?? t("listings.apply.downloadApplication")}
            </Button>
          )}
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
      <Modal
        open={!!showDownloadModal}
        title={t("listings.chooseALanguage")}
        ariaDescription={t("listings.chooseALanguage")}
        onClose={() => setShowDownloadModal(false)}
        actions={[
          <Button
            size={AppearanceSizeType.small}
            onClick={async () => {
              await downloadExternalPDF(paperApplicationURL, "name")
              setSiteAlertMessage(t("listings.apply.downloadApplicationSuccess"), "success")
              setShowDownloadModal(false)
            }}
            styleType={AppearanceStyleType.primary}
          >
            {t("t.download")}
          </Button>,
          <Button
            onClick={() => {
              setShowDownloadModal(false)
            }}
            size={AppearanceSizeType.small}
          >
            {t("t.cancel")}
          </Button>,
        ]}
      >
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
      </Modal>
    </section>
  )
}

export { GetApplication as default, GetApplication }
