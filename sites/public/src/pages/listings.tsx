import React from "react"
import { Jurisdiction, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { fetchClosedListings, fetchJurisdictionByName, fetchOpenListings } from "../lib/hooks"
import { ListingBrowse } from "../components/browse/ListingBrowse"
import { ListingBrowseDeprecated } from "../components/browse/ListingBrowseDeprecated"

export interface ListingsProps {
  openListings: Listing[]
  closedListings: Listing[]
  jurisdiction: Jurisdiction
  paginationData: {
    currentPage: number
    itemCount: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
  }
}

export default function ListingsPage(props: ListingsProps) {
  return (
    <>
      {process.env.showNewSeedsDesigns ? (
        <ListingBrowse
          openListings={props.openListings}
          closedListings={props.closedListings}
          jurisdiction={props.jurisdiction}
          paginationData={props.paginationData}
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
export async function getServerSideProps(context: { req: any }) {
  const openListings = fetchOpenListings(context.req)
  const closedListings = fetchClosedListings(context.req)
  const jurisdiction = fetchJurisdictionByName(context.req)

  return {
    props: {
      openListings: (await openListings)?.items || [],
      closedListings: (await closedListings)?.items || [],
      paginationData: (await openListings)?.meta,
      jurisdiction: await jurisdiction,
      paginationData: (await openListings)?.meta,
    },
  }
}
