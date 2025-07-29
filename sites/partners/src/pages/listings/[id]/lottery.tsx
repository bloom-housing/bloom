import React, { useState, useContext, useMemo } from "react"
import Head from "next/head"
import axios from "axios"
import dayjs from "dayjs"
import Markdown from "markdown-to-jsx"
import { useRouter } from "next/router"
import advancedFormat from "dayjs/plugin/advancedFormat"
import Ticket from "@heroicons/react/24/solid/TicketIcon"
import Download from "@heroicons/react/24/solid/ArrowDownTrayIcon"
import ExclamationCirleIcon from "@heroicons/react/24/solid/ExclamationCircleIcon"
import { t, Breadcrumbs, BreadcrumbLink } from "@bloom-housing/ui-components"
import { Button, Card, Dialog, Heading, Icon, Message } from "@bloom-housing/ui-seeds"
import { CardHeader, CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import {
  Listing,
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  LotteryActivityLogItem,
  LotteryStatusEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import Layout from "../../../layouts"
import { ExportTermsDialog } from "../../../components/shared/ExportTermsDialog"
import { ListingContext } from "../../../components/listings/ListingContext"
import { MetaTags } from "../../../components/shared/MetaTags"
import ListingGuard from "../../../components/shared/ListingGuard"
import { NavigationHeader } from "../../../components/shared/NavigationHeader"
import { ListingStatusBar } from "../../../components/listings/ListingStatusBar"
import { logger } from "../../../logger"
import { useFlaggedApplicationsMeta, useLotteryActivityLog, useZipExport } from "../../../lib/hooks"
dayjs.extend(advancedFormat)

import styles from "../../../../styles/lottery.module.scss"

const Lottery = (props: { listing: Listing | undefined }) => {
  const metaDescription = ""
  const metaImage = ""

  const { listing } = props

  const { addToast } = useContext(MessageContext)
  const router = useRouter()

  const [runModal, setRunModal] = useState(false)
  const [reRunModal, setReRunModal] = useState(false)
  const [releaseModal, setReleaseModal] = useState(false)
  const [exportModal, setExportModal] = useState(false)
  const [termsExportModal, setTermsExportModal] = useState(false)
  const [publishModal, setPublishModal] = useState(false)
  const [retractModal, setRetractModal] = useState(false)
  const [newApplicationsModal, setNewApplicationsModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const { lotteryService, profile } = useContext(AuthContext)

  const listingJurisdiction = profile?.jurisdictions?.find(
    (jurisdiction) => jurisdiction.id === listing?.jurisdictions.id
  )

  const includeDemographicsPartner =
    profile?.userRoles?.isPartner && listingJurisdiction?.enablePartnerDemographics

  const { onExport, exportLoading } = useZipExport(
    listing?.id,
    (profile?.userRoles?.isAdmin ||
      profile?.userRoles?.isJurisdictionalAdmin ||
      includeDemographicsPartner) ??
      false,
    true,
    false,
    !!process.env.useSecureDownloadPathway
  )
  const { data } = useFlaggedApplicationsMeta(listing?.id)
  const { lotteryActivityLogData } = useLotteryActivityLog(listing?.id)
  const duplicatesExist = data?.totalPendingCount > 0
  let formattedExpiryDate: string
  if (process.env.lotteryDaysTillExpiry) {
    const expiryDate = dayjs(listing?.closedAt).add(
      Number(process.env.lotteryDaysTillExpiry),
      "day"
    )
    formattedExpiryDate = expiryDate.format("MM/DD/YYYY")
  }

  const eventMap = {
    closed: t("listings.lottery.historyLogClosed"),
    ran: t("listings.lottery.historyLogRun"),
    rerun: t("listings.lottery.historyLogReRun"),
    releasedToPartners: t("listings.lottery.historyLogReleased"),
    retracted: t("listings.lottery.historyLogRetracted"),
    publishedToPublic: t("listings.lottery.historyLogPublished"),
  }

  const getHistoryItem = ({ logDate, name, status }: LotteryActivityLogItem, key: number) => {
    let user
    if (status === ListingsStatusEnum.closed) {
      user = t("listings.lottery.historyLogByProperty")
    } else if (
      (status === LotteryStatusEnum.publishedToPublic || status === LotteryStatusEnum.expired) &&
      !name
    ) {
      user = t("listings.lottery.historyLogBySystem")
    } else {
      user = t("listings.lottery.historyLogUser", { name: name })
    }
    return (
      <div className={styles["history-item"]} key={key}>
        <div>
          {t("listings.lottery.historyLogTimestamp", {
            date: dayjs(logDate).format("MMMM Do, YYYY"),
            time: dayjs(logDate).format("h:mm a"),
          })}
        </div>
        <div className={styles["event"]}>{eventMap[status]}</div>
        <div className={styles["user"]}>{user}</div>
      </div>
    )
  }

  const historyItems = useMemo(() => {
    if (!lotteryActivityLogData) return

    const items = []

    lotteryActivityLogData.forEach((logItem, index) => {
      if (Object.keys(eventMap).indexOf(logItem.status) >= 0) {
        items.push(getHistoryItem(logItem, index))
      }
    })

    return items
  }, [lotteryActivityLogData])

  if (!listing) return <div>{t("t.errorOccurred")}</div>

  const getMainContent = () => {
    const exportCard = (
      <CardSection>
        <Icon size="xl">
          <Download />
        </Icon>
        <Heading priority={2} size={"2xl"} id={"lottery-heading"}>
          {t("listings.lottery.export")}
        </Heading>
        <div className={styles["card-description"]}>
          {listing.listingMultiselectQuestions.length
            ? t("listings.lottery.exportFile")
            : t("listings.lottery.exportFileNoPreferences")}
        </div>
        <div>
          <Button
            disabled={loading || exportLoading}
            onClick={() => {
              if (profile?.userRoles?.isAdmin) {
                setExportModal(true)
              } else {
                setTermsExportModal(true)
              }
            }}
          >
            {t("t.export")}
          </Button>
        </div>
      </CardSection>
    )

    if (profile?.userRoles?.isAdmin) {
      if (listing.lotteryLastRunAt) {
        return exportCard
      } else {
        return (
          <CardSection>
            <Icon size="xl">
              <Ticket />
            </Icon>
            <Heading priority={2} size={"2xl"}>
              {t("listings.lottery.noData")}
            </Heading>
            <div className={styles["card-description"]}>
              {t("listings.lottery.noDataDescription")}
            </div>
            <div>
              <Button
                onClick={() => {
                  setRunModal(true)
                }}
                disabled={loading || exportLoading}
                id={"lottery-run-button"}
              >
                {t("listings.lottery.runLottery")}
              </Button>
            </div>
          </CardSection>
        )
      }
    } else {
      const lotteryDate = listing.listingEvents.find(
        (event) => event.type === ListingEventsTypeEnum.publicLottery
      )
      if (listing.lotteryStatus === LotteryStatusEnum.releasedToPartners) {
        // reverse array to find most recent release date
        const lotteryReleaseDate = lotteryActivityLogData
          ?.reverse()
          ?.find((logItem) => logItem.status === LotteryStatusEnum.releasedToPartners)?.logDate
        return (
          <CardSection>
            <Icon size="xl">
              <Ticket />
            </Icon>
            <Heading priority={2} size={"2xl"}>
              {t("listings.lottery.publishLotteryData")}
            </Heading>
            <div className={styles["card-description"]}>
              {/* TODO: Update dates */}
              <p>
                {t("listings.lottery.partnerPublishTimestamp", {
                  adminName: t("listings.lottery.partnerPublishTimestampAdmin"),
                  date: dayjs(lotteryReleaseDate).format("MM/DD/YYYY"),
                  time: dayjs(lotteryReleaseDate).format("h:mm a"),
                  portal: t("listings.lottery.partnerPublishTimestampPortal"),
                })}
              </p>
            </div>
            <div>
              <Button
                onClick={() => {
                  setPublishModal(true)
                }}
                id={"lottery-publish-button"}
              >
                {t("listings.actions.publish")}
              </Button>
            </div>
          </CardSection>
        )
      } else if (listing.lotteryStatus === LotteryStatusEnum.publishedToPublic) {
        return exportCard
      }
      if (listing.lotteryStatus === LotteryStatusEnum.expired) {
        return (
          <CardSection>
            <Icon size="xl">
              <ExclamationCirleIcon />
            </Icon>
            <Heading priority={2} size={"2xl"}>
              {t("listings.lottery.noData")}
            </Heading>
            <div className={styles["card-description"]}>
              {t("listings.lottery.dataExpiryDescription")}
            </div>
          </CardSection>
        )
      } else {
        return (
          <CardSection>
            <Icon size="xl">
              <Ticket />
            </Icon>
            <Heading priority={2} size={"2xl"}>
              {t("listings.lottery.noData")}
            </Heading>
            <div className={styles["card-description-no-button"]}>
              {lotteryDate && (
                <span>
                  {t("listings.lottery.noDataDescriptionPartnerDate", {
                    date: dayjs(lotteryDate?.startDate).format("MM/DD/YYYY"),
                    time: dayjs(lotteryDate?.startTime).format("h:mm a"),
                  })}{" "}
                </span>
              )}
              {t("listings.lottery.noDataDescriptionPartner")}{" "}
              <a href={`mailto:${t("listings.lottery.noDataEmail")}`}>
                {t("listings.lottery.noDataEmail")}
              </a>{" "}
              {t("listings.lottery.noDataDescriptionPartnerEmail")}
            </div>
          </CardSection>
        )
      }
    }
  }

  const getActions = () => {
    if (profile?.userRoles?.isAdmin) {
      return (
        <div className={styles["actions-container"]}>
          <>
            {listing.lotteryStatus && (
              <Button
                className={styles["action"]}
                onClick={() => setReRunModal(true)}
                variant={"primary-outlined"}
                id={"lottery-rerun-button"}
              >
                {t("listings.lottery.reRun")}
              </Button>
            )}
            {listing.lotteryStatus === LotteryStatusEnum.ran && (
              <Button
                className={styles["action"]}
                onClick={() => {
                  if (listing?.lotteryLastRunAt < listing?.lastApplicationUpdateAt) {
                    setNewApplicationsModal(true)
                  } else {
                    setReleaseModal(true)
                  }
                }}
                variant={"primary-outlined"}
                id={"lottery-release-button"}
              >
                {t("listings.lottery.release")}
              </Button>
            )}
            {(listing.lotteryStatus === LotteryStatusEnum.releasedToPartners ||
              listing.lotteryStatus === LotteryStatusEnum.publishedToPublic) && (
              <Button
                className={styles["action"]}
                onClick={() => setRetractModal(true)}
                variant={"alert-outlined"}
                id={"lottery-retract-button"}
              >
                {t("listings.lottery.retract")}
              </Button>
            )}
          </>
        </div>
      )
    }
  }

  return (
    <ListingContext.Provider value={listing}>
      <ListingGuard>
        <>
          <Layout>
            <Head>
              <title>{`Lottery - ${t("nav.siteTitlePartners")}`}</title>
            </Head>

            <MetaTags
              title={t("nav.siteTitlePartners")}
              image={metaImage}
              description={metaDescription}
            />

            <NavigationHeader
              title={listing.name}
              listingId={listing.id}
              tabs={{
                show: true,
                listingLabel: t("t.listingSingle"),
                applicationsLabel: t("nav.applications"),
                lotteryLabel:
                  listing.status === ListingsStatusEnum.closed &&
                  listing?.lotteryOptIn &&
                  listing?.reviewOrderType === ReviewOrderTypeEnum.lottery
                    ? t("listings.lotteryTitle")
                    : undefined,
              }}
              breadcrumbs={
                <Breadcrumbs>
                  <BreadcrumbLink href="/">{t("t.listing")}</BreadcrumbLink>
                  <BreadcrumbLink href={`/listings/${listing.id}`}>{listing.name}</BreadcrumbLink>
                  <BreadcrumbLink href={`/listings/${listing.id}/lottery`} current>
                    {t("listings.lotteryTitle")}
                  </BreadcrumbLink>
                </Breadcrumbs>
              }
            />

            <ListingStatusBar status={listing?.status} />
            <section className={styles["lottery"]}>
              <div className={styles["parent"]}>
                <div className={styles["container"]}>
                  <div className={styles["main"]}>
                    {!profile?.userRoles.isAdmin &&
                      process.env.lotteryDaysTillExpiry &&
                      listing?.lotteryStatus === LotteryStatusEnum.publishedToPublic && (
                        <Message
                          variant={"warn"}
                          fullwidth={true}
                          className={styles["applications-expiration-message"]}
                        >
                          {t("listings.lottery.dataExpiryMessage", {
                            date: formattedExpiryDate,
                          })}
                        </Message>
                      )}
                    <Card spacing={"lg"}>{getMainContent()}</Card>
                  </div>
                  <aside className={styles["side"]}>
                    <>
                      {getActions()}
                      <Card>
                        <CardHeader>
                          <Heading priority={2} size={"lg"}>
                            {t("listings.lottery.history")}
                          </Heading>
                        </CardHeader>
                        <CardSection>{historyItems}</CardSection>
                      </Card>
                    </>
                  </aside>
                </div>
              </div>
            </section>
          </Layout>
          <Dialog
            isOpen={!!runModal}
            ariaLabelledBy="run-lottery-modal-header"
            ariaDescribedBy="run-lottery-modal-content"
            onClose={() => setRunModal(false)}
          >
            <Dialog.Header id="run-lottery-modal-header">
              {t("applications.addConfirmModalHeader")}
            </Dialog.Header>
            <Dialog.Content id="run-lottery-modal-content">
              {duplicatesExist ? (
                <p>
                  {t("listings.lottery.duplicateContent")}{" "}
                  <span className={"font-semibold"}>
                    {t(
                      data?.totalPendingCount === 1
                        ? "listings.lottery.duplicateString"
                        : "listings.lottery.duplicateStringPlural",
                      {
                        sets: data?.totalPendingCount?.toString(),
                      }
                    )}
                  </span>{" "}
                  {t("listings.lottery.duplicatesConfirm")}
                </p>
              ) : (
                <p>{t("listings.lottery.runLotteryContent")}</p>
              )}
              <p>{t("applications.addConfirmModalAddApplicationPostLotteryAreYouSure")}</p>
            </Dialog.Content>
            <Dialog.Footer>
              <Button
                variant={duplicatesExist ? "alert" : "primary"}
                onClick={async () => {
                  setLoading(true)
                  try {
                    await lotteryService.lotteryGenerate({ body: { id: listing.id } })
                    setLoading(false)
                    setRunModal(false)
                    addToast(t("listings.lottery.toast.run"), { variant: "success" })
                    await router.push(`/listings/${listing.id}/lottery`)
                  } catch (err) {
                    console.log(err)
                    setLoading(false)
                    addToast(t("account.settings.alerts.genericError"), { variant: "alert" })
                  }
                }}
                size="sm"
                loadingMessage={loading || exportLoading ? t("t.loading") : undefined}
                id={"lottery-run-modal-button"}
              >
                {duplicatesExist
                  ? t("listings.lottery.runLotteryDuplicates")
                  : t("listings.lottery.runLottery")}
              </Button>
              <Button
                variant="primary-outlined"
                onClick={() => {
                  setRunModal(false)
                }}
                size="sm"
              >
                {t("t.cancel")}
              </Button>
            </Dialog.Footer>
          </Dialog>
          <Dialog
            isOpen={!!reRunModal}
            ariaLabelledBy="rerun-lottery-modal-header"
            ariaDescribedBy="rerun-lottery-modal-content"
            onClose={() => setReRunModal(false)}
          >
            <Dialog.Header id="rerun-lottery-modal-header">{t("t.areYouSure")}</Dialog.Header>
            <Dialog.Content id="rerun-lottery-modal-content">
              {listing.lotteryStatus === LotteryStatusEnum.releasedToPartners ||
              listing.lotteryStatus === LotteryStatusEnum.publishedToPublic ? (
                <>
                  <p>{t("listings.lottery.reRunContentAfterRelease")}</p>
                  {listing.lotteryStatus === LotteryStatusEnum.publishedToPublic && (
                    <p className={"font-semibold"}>
                      {t("listings.lottery.reRunContentAfterReleaseRemoval")}
                    </p>
                  )}
                  <p>{t("applications.addConfirmModalAddApplicationPostLotteryAreYouSure")}</p>
                </>
              ) : (
                <>
                  <p>
                    <span>{t("listings.lottery.reRunContent")}</span>{" "}
                    <span className={"font-semibold"}>
                      {t("listings.lottery.reRunCannotBeUndone")}
                    </span>
                  </p>
                  <p>{t("listings.lottery.reRunHistory")}</p>
                  <p>{t("applications.addConfirmModalAddApplicationPostLotteryAreYouSure")}</p>
                </>
              )}
            </Dialog.Content>
            <Dialog.Footer>
              <Button
                variant="alert"
                onClick={async () => {
                  setLoading(true)
                  try {
                    await lotteryService.lotteryGenerate({ body: { id: listing.id } })
                    setLoading(false)
                    setReRunModal(false)
                    addToast(t("listings.lottery.toast.rerun"), { variant: "success" })
                    await router.push(`/listings/${listing.id}/lottery`)
                  } catch (err) {
                    console.log(err)
                    setLoading(false)
                    addToast(t("account.settings.alerts.genericError"), { variant: "alert" })
                  }
                }}
                size="sm"
                loadingMessage={loading ? t("t.loading") : null}
                id={"lottery-rerun-modal-button"}
              >
                {t("listings.lottery.reRunUnderstand")}
              </Button>
              <Button
                variant="primary-outlined"
                onClick={() => {
                  setReRunModal(false)
                }}
                size="sm"
              >
                {t("t.cancel")}
              </Button>
            </Dialog.Footer>
          </Dialog>
          <Dialog
            isOpen={!!releaseModal}
            ariaLabelledBy="release-lottery-modal-header"
            ariaDescribedBy="release-lottery-modal-content"
            onClose={() => setReleaseModal(false)}
          >
            <Dialog.Header id="release-lottery-modal-header">{t("t.areYouSure")}</Dialog.Header>
            <Dialog.Content id="release-lottery-modal-content">
              <p>{t("listings.lottery.releaseContent")}</p>
              <p>{t("applications.addConfirmModalAddApplicationPostLotteryAreYouSure")}</p>
            </Dialog.Content>
            <Dialog.Footer>
              <Button
                variant="primary"
                onClick={async () => {
                  setLoading(true)
                  try {
                    await lotteryService.lotteryStatus({
                      body: {
                        id: listing.id,
                        lotteryStatus: LotteryStatusEnum.releasedToPartners,
                      },
                    })
                    setLoading(false)
                    setReleaseModal(false)
                    addToast(t("listings.lottery.toast.released"), { variant: "success" })
                    await router.push(`/listings/${listing.id}/lottery`)
                  } catch (err) {
                    console.log(err)
                    setLoading(false)
                    addToast(t("account.settings.alerts.genericError"), { variant: "alert" })
                  }
                }}
                loadingMessage={loading ? t("t.loading") : null}
                size="sm"
                id={"lottery-release-modal-button"}
              >
                {t("listings.lottery.releaseButton")}
              </Button>
              <Button
                variant="primary-outlined"
                onClick={() => {
                  setReleaseModal(false)
                }}
                size="sm"
              >
                {t("t.cancel")}
              </Button>
            </Dialog.Footer>
          </Dialog>
          <Dialog
            isOpen={!!newApplicationsModal}
            ariaLabelledBy="new-applications-modal-header"
            ariaDescribedBy="new-applications-modal-content"
            onClose={() => setNewApplicationsModal(false)}
          >
            <Dialog.Header id="new-applications-modal-header">
              {t("listings.lottery.newAppsHeader")}
            </Dialog.Header>
            <Dialog.Content id="new-applications-modal-content">
              <p>{t("listings.lottery.newApps")}</p>
              <p className={"font-semibold"}>{t("listings.lottery.newAppsReRun")}</p>
            </Dialog.Content>
            <Dialog.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  setNewApplicationsModal(false)
                }}
                size="sm"
              >
                {t("t.ok")}
              </Button>
            </Dialog.Footer>
          </Dialog>
          <Dialog
            isOpen={!!retractModal}
            ariaLabelledBy="retract-lottery-modal-header"
            ariaDescribedBy="retract-lottery-modal-content"
            onClose={() => setRetractModal(false)}
          >
            <Dialog.Header id="retract-lottery-modal-header">{t("t.areYouSure")}</Dialog.Header>
            <Dialog.Content id="retract-lottery-modal-content">
              <p>
                {t("listings.lottery.retractContent")}{" "}
                <span className={"font-semibold"}>
                  {t("listings.lottery.retractContentRemoval")}
                </span>
              </p>
              <p>{t("applications.addConfirmModalAddApplicationPostLotteryAreYouSure")}</p>
            </Dialog.Content>
            <Dialog.Footer>
              <Button
                variant="alert"
                onClick={async () => {
                  setLoading(true)
                  try {
                    await lotteryService.lotteryStatus({
                      body: {
                        id: listing.id,
                        lotteryStatus: LotteryStatusEnum.ran,
                      },
                    })
                    setLoading(false)
                    setRetractModal(false)
                    addToast(t("listings.lottery.toast.retracted"), { variant: "success" })
                    await router.push(`/listings/${listing.id}/lottery`)
                  } catch (err) {
                    console.log(err)
                    setLoading(false)
                    addToast(t("account.settings.alerts.genericError"), { variant: "alert" })
                  }
                }}
                loadingMessage={loading ? t("t.loading") : null}
                size="sm"
                id={"lottery-retract-modal-button"}
              >
                {t("listings.lottery.retract")}
              </Button>
              <Button
                variant="primary-outlined"
                onClick={() => {
                  setRetractModal(false)
                }}
                size="sm"
              >
                {t("t.cancel")}
              </Button>
            </Dialog.Footer>
          </Dialog>
          <Dialog
            isOpen={!!exportModal}
            ariaLabelledBy="export-lottery-modal-header"
            ariaDescribedBy="export-lottery-modal-content"
            onClose={() => setExportModal(false)}
          >
            <Dialog.Header id="export-lottery-modal-header">
              {t("listings.lottery.export")}
            </Dialog.Header>
            <Dialog.Content id="export-lottery-modal-content">
              <p>
                {listing.listingMultiselectQuestions.length
                  ? t("listings.lottery.exportFile")
                  : t("listings.lottery.exportFileNoPreferences")}{" "}
                {t("listings.lottery.exportContentTimestamp", {
                  date: dayjs(listing.lotteryLastRunAt).format("MM/DD/YYYY"),
                  time: dayjs(listing.lotteryLastRunAt).format("h:mm a"),
                })}
              </p>
            </Dialog.Content>
            <Dialog.Footer>
              <Button
                variant="primary"
                onClick={async () => {
                  setLoading(true)
                  try {
                    await onExport()
                    setLoading(false)
                    setExportModal(false)
                  } catch {
                    setLoading(false)
                    addToast(t("account.settings.alerts.genericError"), { variant: "alert" })
                  }
                }}
                size="sm"
                loadingMessage={loading || exportLoading ? t("t.loading") : undefined}
              >
                {t("t.export")}
              </Button>
              <Button
                variant="primary-outlined"
                onClick={() => {
                  setExportModal(false)
                }}
                size="sm"
              >
                {t("t.cancel")}
              </Button>
            </Dialog.Footer>
          </Dialog>
          <ExportTermsDialog
            dialogHeader={t("listings.lottery.export")}
            id="partner-lottery"
            isOpen={!!termsExportModal}
            onClose={() => setTermsExportModal(false)}
            onSubmit={async () => {
              setLoading(true)
              try {
                await onExport()
                setLoading(false)
                setTermsExportModal(false)
              } catch {
                setLoading(false)
                addToast(t("account.settings.alerts.genericError"), { variant: "alert" })
              }
            }}
            loadingState={loading || exportLoading}
          >
            <p>
              {listing.listingMultiselectQuestions.length
                ? t("listings.lottery.exportFile")
                : t("listings.lottery.exportFileNoPreferences")}{" "}
              {t("listings.lottery.exportContentTimestamp", {
                date: dayjs(listing.lotteryLastRunAt).format("MM/DD/YYYY"),
                time: dayjs(listing.lotteryLastRunAt).format("h:mm a"),
              })}
            </p>
            <p>{t("listings.lottery.termsAccept")}</p>
            <h2 className={styles["terms-of-use-header"]}>
              {t("authentication.terms.termsOfUse")}
            </h2>
            <Markdown>{t("listings.lottery.terms")}</Markdown>
          </ExportTermsDialog>
          <Dialog
            isOpen={!!publishModal}
            ariaLabelledBy="publish-lottery-modal-header"
            ariaDescribedBy="publish-lottery-modal-content"
            onClose={() => setPublishModal(false)}
          >
            <Dialog.Header id="publish-lottery-modal-header">
              {t("applications.addConfirmModalHeader")}
            </Dialog.Header>
            <Dialog.Content id="publish-lottery-modal-content">
              <p>{t("listings.lottery.publishContent")}</p>
              <p>{t("applications.addConfirmModalAddApplicationPostLotteryAreYouSure")}</p>
            </Dialog.Content>
            <Dialog.Footer>
              <Button
                variant="primary"
                onClick={async () => {
                  setLoading(true)
                  try {
                    await lotteryService.lotteryStatus({
                      body: {
                        id: listing.id,
                        lotteryStatus: LotteryStatusEnum.publishedToPublic,
                      },
                    })
                    setLoading(false)
                    setPublishModal(false)
                    addToast(t("listings.lottery.toast.published"), { variant: "success" })
                    await router.push(`/listings/${listing.id}/lottery`)
                  } catch (err) {
                    console.log(err)
                    setLoading(false)
                    addToast(t("account.settings.alerts.genericError"), { variant: "alert" })
                  }
                }}
                loadingMessage={loading ? t("t.loading") : null}
                size="sm"
                id={"lottery-publish-modal-button"}
              >
                {t("listings.lottery.publishLottery")}
              </Button>
              <Button
                variant="primary-outlined"
                onClick={() => {
                  setPublishModal(false)
                }}
                size="sm"
              >
                {t("t.cancel")}
              </Button>
            </Dialog.Footer>
          </Dialog>
        </>
      </ListingGuard>
    </ListingContext.Provider>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { params: Record<string, string>; req: any }) {
  let response
  const backendUrl = `/listings/${context.params.id}`

  try {
    logger.info(`GET - ${backendUrl}`)
    const headers: Record<string, string> = {
      "x-forwarded-for": context.req.headers["x-forwarded-for"] ?? context.req.socket.remoteAddress,
    }

    if (process.env.API_PASS_KEY) {
      headers.passkey = process.env.API_PASS_KEY
    }

    response = await axios.get(`${process.env.backendApiBase}${backendUrl}`, {
      headers,
    })
  } catch (e) {
    if (e.response) {
      logger.error(`GET - ${backendUrl} - ${e.response?.status} - ${e.response?.statusText}`)
    } else {
      logger.error("partner backend url adapter error:", e)
    }
    return { notFound: true }
  }

  return { props: { listing: response.data } }
}

export default Lottery
