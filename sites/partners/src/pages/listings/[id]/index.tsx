import React, { useContext, useState } from "react"
import Head from "next/head"
import axios from "axios"
import { t, AlertBox, Breadcrumbs, BreadcrumbLink } from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  Listing,
  ListingsStatusEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ListingStatusBar } from "../../../components/listings/ListingStatusBar"
import ListingGuard from "../../../components/shared/ListingGuard"
import { NavigationHeader } from "../../../components/shared/NavigationHeader"
import Layout from "../../../layouts/index"
import ListingFormActions, {
  ListingFormActionsType,
} from "../../../components/listings/ListingFormActions"
import { ListingContext } from "../../../components/listings/ListingContext"
import DetailListingData from "../../../components/listings/PaperListingDetails/sections/DetailListingData"
import DetailListingIntro from "../../../components/listings/PaperListingDetails/sections/DetailListingIntro"
import DetailListingPhotos from "../../../components/listings/PaperListingDetails/sections/DetailListingPhotos"
import DetailBuildingDetails from "../../../components/listings/PaperListingDetails/sections/DetailBuildingDetails"
import DetailAdditionalDetails from "../../../components/listings/PaperListingDetails/sections/DetailAdditionalDetails"
import DetailAdditionalEligibility from "../../../components/listings/PaperListingDetails/sections/DetailAdditionalEligibility"
import DetailLeasingAgent from "../../../components/listings/PaperListingDetails/sections/DetailLeasingAgent"
import DetailAdditionalFees from "../../../components/listings/PaperListingDetails/sections/DetailAdditionalFees"
import { DetailUnits } from "../../../components/listings/PaperListingDetails/sections/DetailUnits"
import DetailUnitDrawer, {
  UnitDrawer,
} from "../../../components/listings/PaperListingDetails/DetailsUnitDrawer"
import DetailBuildingFeatures from "../../../components/listings/PaperListingDetails/sections/DetailBuildingFeatures"
import DetailRankingsAndResults from "../../../components/listings/PaperListingDetails/sections/DetailRankingsAndResults"
import DetailApplicationTypes from "../../../components/listings/PaperListingDetails/sections/DetailApplicationTypes"
import DetailApplicationAddress from "../../../components/listings/PaperListingDetails/sections/DetailApplicationAddress"
import DetailApplicationDates from "../../../components/listings/PaperListingDetails/sections/DetailApplicationDates"
import DetailPreferences from "../../../components/listings/PaperListingDetails/sections/DetailPreferences"
import DetailCommunityType from "../../../components/listings/PaperListingDetails/sections/DetailCommunityType"
import DetailPrograms from "../../../components/listings/PaperListingDetails/sections/DetailPrograms"
import DetailListingNotes from "../../../components/listings/PaperListingDetails/sections/DetailNotes"
import { logger } from "../../../logger"

interface ListingProps {
  listing: Listing
}

export default function ListingDetail(props: ListingProps) {
  const { listing } = props
  const { profile } = useContext(AuthContext)
  const [errorAlert, setErrorAlert] = useState<string>(null)
  const [unitDrawer, setUnitDrawer] = useState<UnitDrawer>(null)

  if (!listing) return null

  return (
    <ListingContext.Provider value={listing}>
      <ListingGuard>
        <>
          <Layout>
            <Head>
              <title>{t("nav.siteTitlePartners")}</title>
            </Head>
            <NavigationHeader
              title={listing.name}
              listingId={listing.id}
              tabs={{
                show: listing.status !== ListingsStatusEnum.pending,
                listingLabel: t("t.listingSingle"),
                applicationsLabel: !profile?.userRoles?.isLimitedJurisdictionalAdmin
                  ? t("nav.applications")
                  : undefined,
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
                  <BreadcrumbLink href={`/listings/${listing.id}`} current>
                    {listing.name}
                  </BreadcrumbLink>
                </Breadcrumbs>
              }
            />

            <ListingStatusBar status={listing.status} />

            <section className="bg-primary-lighter">
              <div className="mx-auto px-5 mt-5 max-w-screen-xl">
                {errorAlert && (
                  <AlertBox
                    className="mb-5"
                    onClose={() => setErrorAlert(null)}
                    closeable
                    type="alert"
                  >
                    {errorAlert || t("authentication.signIn.errorGenericMessage")}
                  </AlertBox>
                )}

                <div className="flex flex-row">
                  <div className="info-card md:w-9/12 overflow-hidden">
                    <DetailListingData />
                    <DetailListingNotes />
                    <DetailListingIntro />
                    <DetailListingPhotos />
                    <DetailBuildingDetails />
                    <DetailCommunityType />
                    <DetailUnits setUnitDrawer={setUnitDrawer} />
                    <DetailPreferences />
                    <DetailPrograms />
                    <DetailAdditionalFees />
                    <DetailBuildingFeatures />
                    <DetailAdditionalEligibility />
                    <DetailAdditionalDetails />
                    <DetailRankingsAndResults />
                    <DetailLeasingAgent />
                    <DetailApplicationTypes />
                    <DetailApplicationAddress />
                    <DetailApplicationDates />
                  </div>

                  <div className="w-full md:w-3/12 md:pl-6">
                    <ListingFormActions
                      type={ListingFormActionsType.details}
                      setErrorAlert={setErrorAlert}
                    />
                  </div>
                </div>
              </div>
            </section>
          </Layout>

          <DetailUnitDrawer unit={unitDrawer} setUnitDrawer={setUnitDrawer} />
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
