import React from "react"
import { fetchClosedListings, fetchJurisdictionByName } from "../lib/hooks"
import { ListingBrowse, TabsIndexEnum } from "../components/browse/ListingBrowse"
import { ListingsProps } from "./listings"
import {
  decodeQueryToFilterData,
  encodeFilterDataToBackendFilters,
  isFiltered,
} from "../components/browse/FilterDrawerHelpers"
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
      areFiltersActive={props.areFiltersActive}
    />
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { req: any; query: any }) {
  let closedListings
  let areFiltersActive = false

  if (isFiltered(context.query)) {
    const filterData = decodeQueryToFilterData(context.query)
    const filters = encodeFilterDataToBackendFilters(filterData)
    closedListings = await fetchClosedListings(
      context.req,
      Number(context.query.page) || 1,
      filters
    )
    areFiltersActive = true
  } else {
    closedListings = await fetchClosedListings(context.req, Number(context.query.page) || 1)
  }
  const jurisdiction = await fetchJurisdictionByName(context.req)

  return {
    props: {
      closedListings: closedListings?.items || [],
      paginationData: closedListings?.items?.length ? closedListings.meta : null,
      jurisdiction: jurisdiction,
      areFiltersActive,
    },
  }
}
