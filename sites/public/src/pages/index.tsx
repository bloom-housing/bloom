import React from "react"
import { GetStaticProps } from "next"
import { Jurisdiction, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Home } from "../components/home/Home"
import { HomeDeprecated } from "../components/home/HomeDeprecated"
import { fetchLimitedUnderConstructionListings, fetchSharedPageProps } from "../lib/hooks"

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
  const [underConstructionListings, shared] = await Promise.all([
    fetchLimitedUnderConstructionListings(undefined, 3),
    fetchSharedPageProps(locale),
  ])

  return {
    props: {
      underConstructionListings: underConstructionListings?.items || [],
      ...shared,
    },
    revalidate: Number(process.env.cacheRevalidate),
  }
}
