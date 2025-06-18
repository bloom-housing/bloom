import React from "react"
import { useRouter } from "next/router"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  decodeQueryToFilterData,
  encodeFilterDataToBackendFilters,
  isFiltered,
} from "../components/browse/FilterDrawerHelpers"
import { ListingBrowse, TabsIndexEnum } from "../components/browse/ListingBrowse"
import { isFeatureFlagOn } from "../lib/helpers"
import { fetchClosedListings, fetchJurisdictionByName, fetchMultiselectData } from "../lib/hooks"
import { ListingsProps } from "./listings"

export default function ListingsPageClosed(props: ListingsProps) {
  const router = useRouter()

  return (
    <ListingBrowse
      listings={props.closedListings}
      tab={TabsIndexEnum.closed}
      jurisdiction={props.jurisdiction}
      multiselectData={props.multiselectData}
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
  const multiselectData = isFeatureFlagOn(
    jurisdiction,
    FeatureFlagEnum.swapCommunityTypeWithPrograms
  )
    ? await fetchMultiselectData(context.req, jurisdiction?.id)
    : null

  return {
    props: {
      closedListings: closedListings?.items || [],
      paginationData: closedListings?.items?.length ? closedListings.meta : null,
      jurisdiction: jurisdiction,
      multiselectData: multiselectData,
      areFiltersActive,
    },
  }
}
