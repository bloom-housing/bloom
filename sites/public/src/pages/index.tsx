import React from "react"
import { GetStaticProps } from "next"
import { Jurisdiction, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Home } from "../components/home/Home"
import { HomeDeprecated } from "../components/home/HomeDeprecated"
import {
  fetchJurisdictionByName,
  fetchLimitedUnderConstructionListings,
  fetchJurisdictionContent,
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
  const [underConstructionListings, jurisdiction, publicOverrides, jurisdictionContent] =
    await Promise.all([
      fetchLimitedUnderConstructionListings(undefined, 3),
      fetchJurisdictionByName(),
      fetchPublicOverrides(locale),
      fetchJurisdictionContent(locale),
    ])

  return {
    props: {
      underConstructionListings: underConstructionListings?.items || [],
      jurisdiction: jurisdiction,
      publicOverrides,
      jurisdictionContent,
    },
    revalidate: Number(process.env.cacheRevalidate),
  }
}
