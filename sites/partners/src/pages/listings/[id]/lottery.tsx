import React, { useState, useContext } from "react"
import Head from "next/head"
import axios from "axios"
import dayjs from "dayjs"
import Ticket from "@heroicons/react/24/solid/TicketIcon"
import Download from "@heroicons/react/24/solid/ArrowDownTrayIcon"
import ExclamationCirleIcon from "@heroicons/react/24/solid/ExclamationCircleIcon"
import { t, Breadcrumbs, BreadcrumbLink } from "@bloom-housing/ui-components"
import { Button, Card, Dialog, Heading, Icon, Message } from "@bloom-housing/ui-seeds"
import { CardHeader, CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  Listing,
  ListingUpdate,
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  LotteryStatusEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import Layout from "../../../layouts"
import { ListingContext } from "../../../components/listings/ListingContext"
import { MetaTags } from "../../../components/shared/MetaTags"
import ListingGuard from "../../../components/shared/ListingGuard"
import { NavigationHeader } from "../../../components/shared/NavigationHeader"
import { ListingStatusBar } from "../../../components/listings/ListingStatusBar"
import { logger } from "../../../logger"
import { useFlaggedApplicationsMeta, useLotteryExport } from "../../../lib/hooks"

import styles from "../../../../styles/lottery.module.scss"

const Lottery = (props: { listing: Listing }) => {
  const metaDescription = ""
  const metaImage = ""

  const { listing } = props

  const [runModal, setRunModal] = useState(false)
  const [reRunModal, setReRunModal] = useState(false)
  const [releaseModal, setReleaseModal] = useState(false)
  const [exportModal, setExportModal] = useState(false)
  const [publishModal, setPublishModal] = useState(false)
  const [retractModal, setRetractModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const { listingsService, lotteryService, profile } = useContext(AuthContext)
  const { onExport, csvExportLoading } = useLotteryExport(listing?.id)
  const { data } = useFlaggedApplicationsMeta(listing?.id)
  const duplicatesExist = data?.totalPendingCount > 0
  let formattedExpiryDate: string
  if (process.env.lotteryDaysTillExpiry) {
    const expiryDate = dayjs(listing?.closedAt).add(
      Number(process.env.lotteryDaysTillExpiry),
      "day"
    )
    formattedExpiryDate = expiryDate.format("MMMM D, YYYY")
  }

  if (!listing) return <div>{t("t.errorOccurred")}</div>

  const getHistoryItem = (dateString: string, event: string, user: string) => {
    return (
      <div className={styles["history-item"]}>
        <div>{dateString}</div>
        <div className={styles["event"]}>{event}</div>
        <div className={styles["user"]}>{user}</div>
      </div>
    )
  }

  const getMainContent = () => {
    const exportCard = (
      <CardSection>
        <Icon size="xl">
          <Download />
        </Icon>
        <Heading priority={2} size={"2xl"}>
          {t("listings.lottery.export")}
        </Heading>
        <div className={styles["card-description"]}>
          {listing.listingMultiselectQuestions.length
            ? t("listings.lottery.exportFile")
            : t("listings.lottery.exportFileNoPreferences")}
        </div>
        <div>
          <Button disabled={loading || csvExportLoading} onClick={() => setExportModal(true)}>
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
                disabled={loading || csvExportLoading}
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
                  date: "DATE",
                  time: "TIME",
                  portal: t("listings.lottery.partnerPublishTimestampPortal"),
                })}
              </p>
            </div>
            <div>
              <Button
                onClick={() => {
                  setPublishModal(true)
                }}
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
            {listing.lotteryStatus === LotteryStatusEnum.ran && (
              <>
                <Button
                  className={styles["action"]}
                  onClick={() => setReRunModal(true)}
                  variant={"primary-outlined"}
                >
                  {t("listings.lottery.reRun")}
                </Button>
                <Button
                  className={styles["action"]}
                  onClick={() => setReleaseModal(true)}
                  variant={"primary-outlined"}
                >
                  {t("listings.lottery.release")}
                </Button>
              </>
            )}
            {(listing.lotteryStatus === LotteryStatusEnum.releasedToPartners ||
              listing.lotteryStatus === LotteryStatusEnum.publishedToPublic) && (
              <Button
                className={styles["action"]}
                onClick={() => setRetractModal(true)}
                variant={"alert-outlined"}
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
              <title>{t("nav.siteTitlePartners")}</title>
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
                        <CardSection>
                          {getHistoryItem(
                            "November 21st, 2023 at 8:30am",
                            "Listing closed",
                            "By property"
                          )}
                          {getHistoryItem(
                            "November 21st, 2023 at 8:30am",
                            "Listing closed",
                            "By property"
                          )}
                        </CardSection>
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
              {process.env.lotteryDaysTillExpiry ? (
                <p>{t("listings.lottery.dialogAlert", { date: formattedExpiryDate })}</p>
              ) : undefined}
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
                  try {
                    setLoading(true)
                    await lotteryService.lotteryGenerate({ body: { listingId: listing.id } })
                    setLoading(false)
                    setRunModal(false)
                    location.reload()
                  } catch (err) {
                    console.log(err)
                  }
                }}
                size="sm"
                loadingMessage={loading || csvExportLoading ? t("t.loading") : undefined}
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
              <p>
                <span>{t("listings.lottery.reRunContent")}</span>{" "}
                <span className={"font-semibold"}>{t("listings.lottery.reRunCannotBeUndone")}</span>
              </p>
              <p>{t("listings.lottery.reRunHistory")}</p>
              <p>{t("applications.addConfirmModalAddApplicationPostLotteryAreYouSure")}</p>
            </Dialog.Content>
            <Dialog.Footer>
              <Button
                variant="alert"
                onClick={() => {
                  // re-run lottery
                  setReRunModal(false)
                }}
                size="sm"
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
                    await listingsService.lotteryStatus({
                      body: {
                        listingId: listing.id,
                        lotteryStatus: LotteryStatusEnum.releasedToPartners,
                      },
                    })
                    location.reload()
                  } catch (err) {
                    console.log(err)
                    setLoading(false)
                  }
                }}
                loadingMessage={loading ? t("t.loading") : null}
                size="sm"
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
                    await listingsService.lotteryStatus({
                      body: {
                        listingId: listing.id,
                        lotteryStatus: LotteryStatusEnum.ran,
                      },
                    })
                    location.reload()
                  } catch (err) {
                    console.log(err)
                    setLoading(false)
                  }
                }}
                loadingMessage={loading ? t("t.loading") : null}
                size="sm"
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
                  await onExport()
                  setExportModal(false)
                }}
                size="sm"
                loadingMessage={loading || csvExportLoading ? t("t.loading") : undefined}
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
                    await listingsService.lotteryStatus({
                      body: {
                        listingId: listing.id,
                        lotteryStatus: LotteryStatusEnum.publishedToPublic,
                      },
                    })
                    location.reload()
                  } catch (err) {
                    console.log(err)
                    setLoading(false)
                  }
                }}
                loadingMessage={loading ? t("t.loading") : null}
                size="sm"
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
