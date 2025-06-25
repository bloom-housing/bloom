import React from "react"
import { Jurisdiction } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Home } from "../components/home/Home"
import { HomeDeprecated } from "../components/home/HomeDeprecated"
import { FormOption } from "../components/listings/search/ListingsSearchModal"

interface HomePageProps {
  jurisdiction: Jurisdiction
  bedrooms: FormOption[]
  counties: FormOption[]
}

export default function HomePage(props: HomePageProps) {
  return (
    <>
      {process.env.showNewSeedsDesigns ? (
        // Doorway doesn't have under construction listings hardcoding to empty array
        <Home jurisdiction={props.jurisdiction} underConstructionListings={[]} />
      ) : (
        <HomeDeprecated
          jurisdiction={props.jurisdiction}
          bedrooms={props.bedrooms}
          counties={props.counties}
        />
      )}
    </>
  )
}
