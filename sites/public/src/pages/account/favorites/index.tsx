import React from "react"
import FavoritesView from "../../../components/account/FavoritesView"
import { Jurisdiction } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { fetchJurisdictionByName } from "../../../lib/hooks"

interface FavoritesProps {
  jurisdiction: Jurisdiction
}

const Favorites = ({ jurisdiction }: FavoritesProps) => {
  return <FavoritesView jurisdiction={jurisdiction} />
}

export default Favorites

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStaticProps() {
  const jurisdiction = await fetchJurisdictionByName()

  return {
    props: { jurisdiction },
  }
}
