import React from "react"
import { fetchClosedListings, fetchJurisdictionByName } from "../lib/hooks"
import { ListingBrowse, TabsIndexEnum } from "../components/browse/ListingBrowse"
import { ListingsProps } from "./listings"
import {
  decodeQueryToFilterData,
  encodeFilterDataToBackendFilters,
  getFilterQueryFromURL,
} from "../components/listing/FilterDrawerHelper"
import { useRouter } from "next/router"

export default function ListingsPageClosed(props: ListingsProps) {
  const router = useRouter()

  return (
    <ListingBrowse
      listings={props.closedListings}
      tab={TabsIndexEnum.closed}
      jurisdiction={props.jurisdiction}
      paginationData={props.paginationData}
      key={router.asPath}
    />
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { req: any; query: any }) {
  let closedListings
  if (context.req.url.includes("filters")) {
    const filterData = decodeQueryToFilterData(getFilterQueryFromURL(context.req.url))
    const filters = encodeFilterDataToBackendFilters(filterData)
    closedListings = await fetchClosedListings(
      context.req,
      Number(context.query.page) || 1,
      filters
    )
  } else {
    closedListings = await fetchClosedListings(context.req, Number(context.query.page) || 1)
  }
  const jurisdiction = await fetchJurisdictionByName(context.req)

  return {
    props: {
      closedListings: closedListings?.items || [],
      paginationData: closedListings?.items?.length ? closedListings.meta : null,
      jurisdiction: jurisdiction,
    },
  }
}
