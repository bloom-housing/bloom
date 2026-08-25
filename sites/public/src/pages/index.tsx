import React from "react"
import { GetStaticProps } from "next"
import { Jurisdiction, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Home } from "../components/home/Home"
import { HomeDeprecated } from "../components/home/HomeDeprecated"
import { fetchJurisdictionByName, fetchLimitedUnderConstructionListings } from "../lib/hooks"
import fs from "fs"
import path from "path"
interface HomePageProps {
  jurisdiction: Jurisdiction
  underConstructionListings: Listing[]
  heroImage?: string
}

export default function HomePage(props: HomePageProps) {
  return (
    <>
      {process.env.showNewSeedsDesigns ? (
        <Home
          jurisdiction={props.jurisdiction}
          underConstructionListings={props.underConstructionListings}
          heroImage={props.heroImage}
        />
      ) : (
        <HomeDeprecated jurisdiction={props.jurisdiction} />
      )}
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const underConstructionListings = await fetchLimitedUnderConstructionListings(undefined, 3)
  const jurisdiction = await fetchJurisdictionByName()

  // hero image is optional so checking server side if the file exists to prevent rerenders on the client
  const fileName = "hero-image.jpg"
  const filePath = path.join(process.cwd(), "public", "images", fileName)
  const imageExists = fs.existsSync(filePath)

  return {
    props: {
      underConstructionListings: underConstructionListings?.items || [],
      jurisdiction: jurisdiction,
      heroImage: imageExists ? fileName : "",
    },
    revalidate: Number(process.env.cacheRevalidate),
  }
}
