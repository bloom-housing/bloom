import React from "react"
import { Jurisdiction, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { fetchClosedListings, fetchJurisdictionByName, fetchOpenListings } from "../lib/hooks"
import { ListingBrowse, TabsIndexEnum } from "../components/browse/ListingBrowse"
import { ListingBrowseDeprecated } from "../components/browse/ListingBrowseDeprecated"
import {
  decodeQueryToFilterData,
  encodeFilterDataToBackendFilters,
  isFiltered,
} from "../components/browse/FilterDrawerHelpers"
import { useRouter } from "next/router"

export interface ListingsProps {
  openListings: Listing[]
  closedListings: Listing[]
  paginationData: {
    currentPage: number
    itemCount: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
  }
  jurisdiction: Jurisdiction
  areFiltersActive: boolean
}

export default function ListingsPage(props: ListingsProps) {
  const router = useRouter()

  return (
    <>
      {process.env.showNewSeedsDesigns ? (
        <ListingBrowse
          listings={props.openListings}
          tab={TabsIndexEnum.open}
          jurisdiction={props.jurisdiction}
          paginationData={props.paginationData}
          key={router.asPath}
          areFiltersActive={props.areFiltersActive}
        />
      ) : (
        <ListingBrowseDeprecated
          openListings={props.openListings}
          closedListings={props.closedListings}
        />
      )}
    </>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { req: any; query: any }) {
  let openListings
  let closedListings
  let areFiltersActive = false

  if (isFiltered(context.query)) {
    const filterData = decodeQueryToFilterData(context.query)
    const filters = encodeFilterDataToBackendFilters(filterData)
    openListings = await fetchOpenListings(context.req, Number(context.query.page) || 1, filters)
    areFiltersActive = true
  } else {
    openListings = await fetchOpenListings(context.req, Number(context.query.page) || 1)
    closedListings = await fetchClosedListings(context.req, Number(context.query.page) || 1)
  }
  const jurisdiction = await fetchJurisdictionByName(context.req)

  return {
    props: {
      openListings: openListings?.items || [],
      closedListings: closedListings?.items || [],
      paginationData: openListings?.items?.length ? openListings.meta : null,
      jurisdiction: jurisdiction,
      areFiltersActive,
    },
  }
}
