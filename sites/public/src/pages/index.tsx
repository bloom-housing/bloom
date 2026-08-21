import React from "react"
import { GetStaticProps } from "next"
import { Jurisdiction, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Home } from "../components/home/Home"
import { HomeDeprecated } from "../components/home/HomeDeprecated"
import {
  fetchJurisdictionByName,
  fetchLimitedUnderConstructionListings,
  fetchPublicOverrides,
} from "../lib/hooks"

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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const [underConstructionListings, jurisdiction, publicOverrides] = await Promise.all([
    fetchLimitedUnderConstructionListings(undefined, 3),
    fetchJurisdictionByName(),
    fetchPublicOverrides(locale),
  ])

  return {
    props: {
      underConstructionListings: underConstructionListings?.items || [],
      jurisdiction: jurisdiction,
      publicOverrides,
    },
    revalidate: Number(process.env.cacheRevalidate),
  }
}
