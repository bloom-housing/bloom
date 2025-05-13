import React from "react"
import { fetchClosedListings, fetchJurisdictionByName } from "../../lib/hooks"
import { ListingBrowse, TabsIndexEnum } from "../../components/browse/ListingBrowse"
import { ListingsProps } from "../listings"

export default function ListingsPageFiltered(props: ListingsProps) {
  return (
    <ListingBrowse
      listings={props.openListings}
      tab={TabsIndexEnum.closed}
      jurisdiction={props.jurisdiction}
      paginationData={props.paginationData}
    />
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { req: any; query: any }) {
  const filteredListings = await fetchClosedListings(context.req, Number(context.query.page) || 1)
  const jurisdiction = await fetchJurisdictionByName(context.req)

  return {
    props: {
      openListings: filteredListings?.items || [],
      paginationData: filteredListings?.items?.length ? filteredListings.meta : null,
      jurisdiction: jurisdiction,
    },
  }
}
