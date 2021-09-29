import Head from "next/head"
import qs from "qs"
import axios from "axios"
import {
  ListingsGroup,
  PageHeader,
  t,
  StatusBarType,
  ApplicationStatusType,
  ListingCard,
  imageUrlFromListing,
  getSummariesTableFromUnitSummary,
} from "@bloom-housing/ui-components"
import {
  Listing,
  ListingStatus,
  ListingReviewOrder,
  Address,
  UnitsSummarized,
} from "@bloom-housing/backend-core/types"
import Layout from "../layouts/application"
import { MetaTags } from "../src/MetaTags"
import moment from "moment"
import { openInFuture } from "../lib/helpers"

export interface ListingsProps {
  openListings: Listing[]
  closedListings: Listing[]
}

const getListingImageCardStatus = (listing: Listing): StatusBarType => {
  let content = ""
  let subContent = ""
  let formattedDate = ""
  let appStatus = ApplicationStatusType.Open

  if (openInFuture(listing)) {
    const date = listing.applicationOpenDate
    const openDate = moment(date)
    formattedDate = openDate.format("MMM. D, YYYY")
    content = t("listings.applicationOpenPeriod")
  } else {
    if (listing.applicationDueDate) {
      const dueDate = moment(listing.applicationDueDate)
      const dueTime = moment(listing.applicationDueTime)
      formattedDate = dueDate.format("MMM. DD, YYYY")

      if (listing.applicationDueTime) {
        formattedDate = formattedDate + ` ${t("t.at")} ` + dueTime.format("h:mm A")
      }

      // if due date is in future, listing is open
      if (moment() < dueDate) {
        content = t("listings.applicationDeadline")
      } else {
        appStatus = ApplicationStatusType.Closed
        content = t("listings.applicationsClosed")
      }
    }
  }

  if (formattedDate != "") {
    content = content + `: ${formattedDate}`
  }

  if (listing.reviewOrderType === ListingReviewOrder.firstComeFirstServe) {
    subContent = content
    content = t("listings.applicationFCFS")
  }

  return {
    status: appStatus,
    content,
    subContent,
  }
}

const getListingCardSubtitle = (address: Address) => {
  const { street, city, state, zipCode } = address || {}
  return address ? `${street}, ${city} ${state}, ${zipCode}` : null
}

const getListingTableData = (unitsSummarized: UnitsSummarized) => {
  return unitsSummarized !== undefined
    ? getSummariesTableFromUnitSummary(unitsSummarized.byUnitTypeAndRent)
    : []
}

const getListings = (listings) => {
  const unitSummariesHeaders = {
    unitType: t("t.unitType"),
    minimumIncome: t("t.minimumIncome"),
    rent: t("t.rent"),
  }
  return listings.map((listing: Listing, index) => {
    return (
      <ListingCard
        key={index}
        imageCardProps={{
          imageUrl:
            imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize || "1302")) || "",
          subtitle: getListingCardSubtitle(listing.buildingAddress),
          title: listing.name,
          href: `/listing/${listing.id}/${listing.urlSlug}`,
          tagLabel: listing.reservedCommunityType
            ? t(`listings.reservedCommunityTypes.${listing.reservedCommunityType.name}`)
            : undefined,
          statuses: [getListingImageCardStatus(listing)],
        }}
        tableProps={{
          headers: unitSummariesHeaders,
          data: getListingTableData(listing.unitsSummarized),
          responsiveCollapse: true,
          cellClassName: "px-5 py-3",
        }}
        seeDetailsLink={`/listing/${listing.id}/${listing.urlSlug}`}
        tableHeaderProps={{
          tableHeader: listing.showWaitlist ? t("listings.waitlist.open") : null,
        }}
      />
    )
  })
}

const openListings = (listings) => {
  return listings.length > 0 ? (
    <>{getListings(listings)}</>
  ) : (
    <div className="notice-block">
      <h3 className="m-auto text-gray-800">{t("listings.noOpenListings")}</h3>
    </div>
  )
}

const closedListings = (listings) => {
  return (
    listings.length > 0 && (
      <ListingsGroup
        listingsCount={listings.length}
        header={t("listings.closedListings")}
        hideButtonText={t("listings.hideClosedListings")}
        showButtonText={t("listings.showClosedListings")}
      >
        {getListings(listings)}
      </ListingsGroup>
    )
  )
}

export default function ListingsPage(props: ListingsProps) {
  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader title={t("pageTitle.rent")} />
      <div>
        {openListings(props.openListings)}
        {closedListings(props.closedListings)}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  let openListings = []
  let closedListings = []

  try {
    const response = await axios.get(process.env.listingServiceUrl, {
      params: {
        view: "base",
        limit: "all",
        filter: [
          {
            $comparison: "<>",
            status: "pending",
          },
        ],
      },
      paramsSerializer: (params) => {
        return qs.stringify(params)
      },
    })

    openListings = response?.data?.items
      ? response.data.items.filter((listing: Listing) => listing.status === ListingStatus.active)
      : []
    closedListings = response?.data?.items
      ? response.data.items.filter((listing: Listing) => listing.status === ListingStatus.closed)
      : []
  } catch (error) {
    console.error(error)
  }

  return { props: { openListings, closedListings }, revalidate: process.env.cacheRevalidate }
}
