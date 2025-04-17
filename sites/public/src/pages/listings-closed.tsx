import React from "react"
import { fetchClosedListings, fetchJurisdictionByName } from "../lib/hooks"
import { ListingBrowse, TabsIndexEnum } from "../components/browse/ListingBrowse"
import { ListingsProps } from "./listings"

export default function ListingsPageClosed(props: ListingsProps) {
  return (
    <ListingBrowse
      listings={props.closedListings}
      tab={TabsIndexEnum.closed}
      jurisdiction={props.jurisdiction}
      paginationData={props.paginationData}
    />
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { req: any; query: any }) {
  const closedListings = await fetchClosedListings(context.req, Number(context.query.page) || 1)
  const jurisdiction = await fetchJurisdictionByName(context.req)

  return {
    props: {
      closedListings: closedListings?.items || [],
      paginationData: closedListings?.items?.length ? closedListings.meta : null,
      jurisdiction: jurisdiction,
    },
  }
}
