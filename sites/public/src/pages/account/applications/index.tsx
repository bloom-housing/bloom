import React, { useEffect } from "react"
import { useRouter } from "next/router"
import ApplicationsView, {
  ApplicationsIndexEnum,
} from "../../../components/account/ApplicationsView"
import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { isFeatureFlagOn } from "../../../lib/helpers"
import { fetchJurisdictionByName } from "../../../lib/hooks"

const AllApplications = ({ jurisdiction }: { jurisdiction: Jurisdiction }) => {
  const router = useRouter()

  useEffect(() => {
    if (isFeatureFlagOn(jurisdiction, FeatureFlagEnum.disableCommonApplication)) {
      console.warn("Page not available in this configuration")
      void router.push("/")
    }
  })

  return <ApplicationsView filterType={ApplicationsIndexEnum.all} />
}

export default AllApplications

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStaticProps() {
  const jurisdiction = await fetchJurisdictionByName()

  return {
    props: { jurisdiction },
  }
}
