import React from "react"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { fetchClosedListings, fetchOpenListings } from "../lib/hooks"
import { ListingBrowse } from "../components/browse/ListingBrowse"
import { ListingBrowseDeprecated } from "../components/browse/ListingBrowseDeprecated"

export interface ListingsProps {
  openListings: Listing[]
  closedListings: Listing[]
}

export default function ListingsPage(props: ListingsProps) {
  return (
    <>
      {process.env.showNewSeedsDesigns ? (
        <ListingBrowse openListings={props.openListings} closedListings={props.closedListings} />
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

  return {
    props: { openListings: await openListings, closedListings: await closedListings },
  }
}
