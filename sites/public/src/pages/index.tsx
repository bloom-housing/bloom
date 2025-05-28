import React from "react"
import { Jurisdiction, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Home } from "../components/home/Home"
import { HomeDeprecated } from "../components/home/HomeDeprecated"
import { fetchJurisdictionByName, fetchLimitedUnderConstructionListings } from "../lib/hooks"

interface HomePageProps {
  jurisdiction: Jurisdiction
  underConstructionListings: Listing[]
}

export default function HomePage(props: HomePageProps) {
  return (
    <>
      {process.env.showNewSeedsDesigns ? (
        <Home
          jurisdiction={props.jurisdiction}
          underConstructionListings={props.underConstructionListings}
        />
      ) : (
        <HomeDeprecated jurisdiction={props.jurisdiction} />
      )}
    </>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { req: any; query: any }) {
  const underConstructionListings = await fetchLimitedUnderConstructionListings(context.req, 3)
  const jurisdiction = await fetchJurisdictionByName(context.req)

  return {
    props: {
      underConstructionListings: underConstructionListings?.items || [],
      jurisdiction: jurisdiction,
    },
  }
}
