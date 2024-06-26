import React from "react"
import Head from "next/head"
import axios from "axios"
import { faTicket } from "@fortawesome/free-solid-svg-icons"
import { t, Breadcrumbs, BreadcrumbLink } from "@bloom-housing/ui-components"
import { Button, Card, Heading, Icon } from "@bloom-housing/ui-seeds"
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

  if (!listing) return false

  const getHistoryItem = (dateString: string, event: string, user: string) => {
    return (
      <div className={styles["history-item"]}>
        <div>{dateString}</div>
        <div className={styles["event"]}>{event}</div>
        <div className={styles["user"]}>{user}</div>
      </div>
    )
  }

  return (
    <ListingContext.Provider value={listing}>
      <ListingGuard>
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
                  <Card spacing={"lg"}>
                    <CardSection>
                      <Icon icon={faTicket} size="2xl" />
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
                  </Card>
                </div>
                <aside className={styles["side"]}>
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
                </aside>
              </div>
            </div>
          </section>
        </Layout>
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
