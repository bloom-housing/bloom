import React, { useMemo, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import axios from "axios"
import {
  AppearanceStyleType,
  PageHeader,
  t,
  Tag,
  Button,
  AlertBox,
  SiteAlert,
} from "@bloom-housing/ui-components"
import { Listing, ListingStatus } from "@bloom-housing/backend-core/types"

import ListingGuard from "../../../src/ListingGuard"
import Layout from "../../../layouts"
import Aside from "../../../src/listings/Aside"
import { ListingContext } from "../../../src/listings/ListingContext"
import DetailListingData from "../../../src/listings/PaperListingDetails/sections/DetailListingData"
import DetailListingIntro from "../../../src/listings/PaperListingDetails/sections/DetailListingIntro"
import DetailListingPhoto from "../../../src/listings/PaperListingDetails/sections/DetailListingPhoto"
import DetailBuildingDetails from "../../../src/listings/PaperListingDetails/sections/DetailBuildingDetails"
import DetailAdditionalDetails from "../../../src/listings/PaperListingDetails/sections/DetailAdditionalDetails"
import DetailAdditionalEligibility from "../../../src/listings/PaperListingDetails/sections/DetailAdditionalEligibility"
import DetailLeasingAgent from "../../../src/listings/PaperListingDetails/sections/DetailLeasingAgent"
import DetailAdditionalFees from "../../../src/listings/PaperListingDetails/sections/DetailAdditionalFees"
import { DetailUnits } from "../../../src/listings/PaperListingDetails/sections/DetailUnits"
import DetailUnitDrawer, {
  UnitDrawer,
} from "../../../src/listings/PaperListingDetails/DetailsUnitDrawer"
import DetailBuildingFeatures from "../../../src/listings/PaperListingDetails/sections/DetailBuildingFeatures"
import DetailRankingsAndResults from "../../../src/listings/PaperListingDetails/sections/DetailRankingsAndResults"
import DetailApplicationTypes from "../../../src/listings/PaperListingDetails/sections/DetailApplicationTypes"
import DetailApplicationAddress from "../../../src/listings/PaperListingDetails/sections/DetailApplicationAddress"
import DetailApplicationDates from "../../../src/listings/PaperListingDetails/sections/DetailApplicationDates"
import DetailPreferences from "../../../src/listings/PaperListingDetails/sections/DetailPreferences"
import DetailCommunityType from "../../../src/listings/PaperListingDetails/sections/DetailCommunityType"
import DetailPrograms from "../../../src/listings/PaperListingDetails/sections/DetailPrograms"

interface ListingProps {
  listing: Listing
}

export default function ListingDetail(props: ListingProps) {
  const router = useRouter()
  /* const listingId = router.query.id as string
  const { listingDto, listingLoading } = useSingleListingData(listingId) */
  const { listing } = props
  const [errorAlert, setErrorAlert] = useState(false)
  const [unitDrawer, setUnitDrawer] = useState<UnitDrawer>(null)

  const listingStatus = useMemo(() => {
    switch (listing?.status) {
      case ListingStatus.active:
        return (
          <Tag styleType={AppearanceStyleType.success} pillStyle>
            {t(`listings.listingStatus.active`)}
          </Tag>
        )
      case ListingStatus.closed:
        return (
          <Tag pillStyle styleType={AppearanceStyleType.closed}>
            {t(`listings.listingStatus.closed`)}
          </Tag>
        )
      default:
        return (
          <Tag styleType={AppearanceStyleType.primary} pillStyle>
            {t(`listings.listingStatus.pending`)}
          </Tag>
        )
    }
  }, [listing?.status])

  if (!listing) return null

  return (
    <ListingContext.Provider value={listing}>
      <ListingGuard>
        <>
          <Layout>
            <Head>
              <title>{t("nav.siteTitlePartners")}</title>
            </Head>

            <PageHeader
              className="relative"
              title={
                <>
                  <p
                    data-test-id="page-header-text"
                    className="font-sans font-semibold uppercase text-3xl"
                  >
                    {listing.name}
                  </p>

                  <p className="font-sans text-base mt-1">{listing.id}</p>
                </>
              }
            >
              <div className="flex top-4 right-4 absolute z-50 flex-col items-center">
                <SiteAlert type="success" timeout={5000} dismissable />
              </div>
            </PageHeader>
            <section className="border-t bg-white">
              <div className="flex flex-row w-full mx-auto max-w-screen-xl justify-between px-5 items-center my-3">
                <Button inlineIcon="left" icon="arrowBack" onClick={() => router.push("/")}>
                  {t("t.back")}
                </Button>

                <div className="status-bar__status md:pl-4 md:w-3/12">{listingStatus}</div>
              </div>
            </section>

            <section className="bg-primary-lighter">
              <div className="mx-auto px-5 mt-5 max-w-screen-xl">
                {errorAlert && (
                  <AlertBox
                    className="mb-5"
                    onClose={() => setErrorAlert(false)}
                    closeable
                    type="alert"
                  >
                    {t("authentication.signIn.errorGenericMessage")}
                  </AlertBox>
                )}

                <div className="flex flex-row flex-wrap ">
                  <div className="info-card md:w-9/12">
                    <DetailListingData />
                    <DetailListingIntro />
                    <DetailListingPhoto />
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

                  <div className="md:w-3/12 pl-6">
                    <Aside type="details" />
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

export async function getServerSideProps(context: { params: Record<string, string> }) {
  let response

  try {
    response = await axios.get(`${process.env.backendApiBase}/listings/${context.params.id}`)
  } catch (e) {
    console.log("e = ", e)
    return { notFound: true }
  }

  return { props: { listing: response.data } }
}
