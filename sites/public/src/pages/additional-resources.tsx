import React, { useEffect, useContext } from "react"
import { useRouter } from "next/router"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import Resources from "../components/resources/Resources"
import { UserStatus } from "../lib/constants"
import { fetchJurisdictionByName } from "../lib/hooks"
import { isFeatureFlagOn } from "../lib/helpers"

const AdditionalResources = ({ jurisdiction }: { jurisdiction: Jurisdiction }) => {
  const { profile } = useContext(AuthContext)
  const router = useRouter()

  const enableResources = isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableResources)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Additional Resources",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  useEffect(() => {
    if (!enableResources) {
      void router.push("/404")
    }
  }, [enableResources, router])

  return <Resources />
}

export default AdditionalResources

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStaticProps() {
  const jurisdiction = await fetchJurisdictionByName()

  return {
    props: { jurisdiction },
  }
}
