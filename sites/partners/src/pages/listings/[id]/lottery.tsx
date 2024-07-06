import React, { useState } from "react"
import Head from "next/head"
import axios from "axios"
import Ticket from "@heroicons/react/24/solid/TicketIcon"
import Download from "@heroicons/react/24/solid/ArrowDownTrayIcon"
import { t, Breadcrumbs, BreadcrumbLink } from "@bloom-housing/ui-components"
import { Button, Card, Heading, Icon, Dialog } from "@bloom-housing/ui-seeds"
import { CardHeader, CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  Listing,
  ListingsStatusEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import Layout from "../../../layouts"
import { ListingContext } from "../../../components/listings/ListingContext"
import { MetaTags } from "../../../components/shared/MetaTags"
import ListingGuard from "../../../components/shared/ListingGuard"
import { NavigationHeader } from "../../../components/shared/NavigationHeader"
import { ListingStatusBar } from "../../../components/listings/ListingStatusBar"
import { logger } from "../../../logger"

import styles from "../../../../styles/lottery.module.scss"

const Lottery = (props: { listing: Listing }) => {
  const metaDescription = ""
  const metaImage = ""

  const { listing } = props

  const [reRunModal, setReRunModal] = useState(false)
  const [releaseModal, setReleaseModal] = useState(false)

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
    if (listing.lotteryLastRunAt) {
      return (
        <CardSection>
          <Icon size="xl">
            <Download />
          </Icon>
          <Heading priority={2} size={"2xl"}>
            {t("listings.lottery.export")}
          </Heading>
          <div className={styles["card-description"]}>{t("listings.lottery.exportFile")}</div>
          <div>
            <Button>{t("t.export")}</Button>
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
          <div className={styles["card-description"]}>
            {t("listings.lottery.noDataDescription")}
          </div>
          <div>
            <Button>{t("listings.lottery.runLottery")}</Button>
          </div>
        </CardSection>
      )
    }
  }

  const getActions = () => {
    if (listing.lotteryLastRunAt) {
      return (
        <div className={styles["actions-container"]}>
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
                  listing.reviewOrderType === ReviewOrderTypeEnum.lottery
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
                {t("listings.lottery.reRunButton")}
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
            <Dialog.Header id="release-lottery-modal-header">
              {t("applications.addConfirmModalHeader")}
            </Dialog.Header>
            <Dialog.Content id="release-lottery-modal-content">
              <p>{t("listings.lottery.releaseContent")}</p>
              <p>{t("applications.addConfirmModalAddApplicationPostLotteryAreYouSure")}</p>
            </Dialog.Content>
            <Dialog.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  // release lottery
                  setReleaseModal(false)
                }}
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
