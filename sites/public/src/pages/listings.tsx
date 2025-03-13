import React from "react"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { fetchClosedListings, fetchOpenListings } from "../lib/hooks"
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
}

export default function ListingsPage(props: ListingsProps) {
  return (
    <>
      {process.env.showNewSeedsDesigns ? (
        <ListingBrowse
          openListings={props.openListings}
          closedListings={props.closedListings}
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
  const openListings = fetchOpenListings(context.req, Number(context.query.page) || 1)
  const closedListings = fetchClosedListings(context.req, Number(context.query.page) || 1)

  return {
    props: {
      openListings: (await openListings)?.items || [],
      closedListings: (await closedListings)?.items || [],
      paginationData: (await openListings)?.meta,
    },
  }
}
