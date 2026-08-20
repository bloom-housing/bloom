import React, { useEffect } from "react"
import { useRouter } from "next/router"
import FavoritesView from "../../../components/account/FavoritesView"
import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  fetchJurisdictionByName,
  fetchJurisdictionContent,
  fetchPublicOverrides,
} from "../../../lib/hooks"
import { isFeatureFlagOn } from "../../../lib/helpers"

interface FavoritesProps {
  jurisdiction: Jurisdiction
}

const Favorites = ({ jurisdiction }: FavoritesProps) => {
  const router = useRouter()

  useEffect(() => {
    if (!isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableListingFavoriting)) {
      console.warn("Page not available in this configuration")
      void router.push("/")
    }
  })

  return <FavoritesView jurisdiction={jurisdiction} />
}

export default Favorites

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStaticProps({ locale }: { locale?: string }) {
  const [jurisdiction, publicOverrides, jurisdictionContent] = await Promise.all([
    fetchJurisdictionByName(),
    fetchPublicOverrides(locale),
    fetchJurisdictionContent(locale),
  ])

  return {
    props: { jurisdiction, publicOverrides, jurisdictionContent },
    revalidate: Number(process.env.cacheRevalidate),
  }
}
