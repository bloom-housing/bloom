import React from "react"
import { fetchJurisdictionByName, fetchOpenListings } from "../../lib/hooks"
import { ListingBrowse, TabsIndexEnum } from "../../components/browse/ListingBrowse"
import { ListingsProps } from "../listings"
import {
  decodeQueryToFilterData,
  encodeFilterDataToBackendFilters,
  getFilterQueryFromURL,
} from "../../components/listing/FilterDrawerHelper"
import { useRouter } from "next/router"

export default function ListingsPageFiltered(props: ListingsProps) {
  const router = useRouter()

  return (
    <ListingBrowse
      listings={props.openListings}
      tab={TabsIndexEnum.open}
      jurisdiction={props.jurisdiction}
      paginationData={props.paginationData}
      key={router.asPath}
    />
  )
}

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { req: any; query: any }) {
  const filterData = decodeQueryToFilterData(getFilterQueryFromURL(context.req.url))
  const filters = encodeFilterDataToBackendFilters(filterData)
  const filteredListings = await fetchOpenListings(
    context.req,
    Number(context.query.page) || 1,
    filters
  )
  const jurisdiction = await fetchJurisdictionByName(context.req)

  return {
    props: {
      openListings: filteredListings?.items || [],
      paginationData: filteredListings?.items?.length ? filteredListings.meta : null,
      jurisdiction: jurisdiction,
    },
  }
}
