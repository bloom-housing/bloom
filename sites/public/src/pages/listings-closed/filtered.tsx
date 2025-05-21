import React from "react"
import { fetchClosedListings, fetchJurisdictionByName } from "../../lib/hooks"
import { ListingBrowse, TabsIndexEnum } from "../../components/browse/ListingBrowse"
import { ListingsProps } from "../listings"
import {
  decodeStringtoFilterData,
  encodeFilterDataToBackendFilters,
  getFilterQueryFromURL,
} from "../../components/listing/FilterDrawerHelper"
import { useRouter } from "next/router"

export default function ListingsPageFiltered(props: ListingsProps) {
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

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { req: any; query: any }) {
  const filterState = decodeStringtoFilterData(getFilterQueryFromURL(context.req.url))
  const filters = encodeFilterDataToBackendFilters(filterState)
  const filteredListings = await fetchClosedListings(
    context.req,
    Number(context.query.page) || 1,
    filters
  )
  const jurisdiction = await fetchJurisdictionByName(context.req)

  return {
    props: {
      closedListings: filteredListings?.items || [],
      paginationData: filteredListings?.items?.length ? filteredListings.meta : null,
      jurisdiction: jurisdiction,
    },
  }
}
