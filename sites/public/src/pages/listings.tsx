import React from "react"
import { Jurisdiction, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { fetchClosedListings, fetchJurisdictionByName, fetchOpenListings } from "../lib/hooks"
import { ListingBrowse } from "../components/browse/ListingBrowse"
import { ListingBrowseDeprecated } from "../components/browse/ListingBrowseDeprecated"

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
export async function getServerSideProps(context: { req: any; query: any }) {
  const openListings = await fetchOpenListings(context.req, Number(context.query.page) || 1)
  const closedListings = await fetchClosedListings(context.req, Number(context.query.page) || 1)
  const jurisdiction = await fetchJurisdictionByName(context.req)

  return {
    props: {
      openListings: openListings?.items || [],
      closedListings: closedListings?.items || [],
      paginationData: openListings?.items?.length ? openListings.meta : null,
      jurisdiction: jurisdiction,
    },
  }
}
