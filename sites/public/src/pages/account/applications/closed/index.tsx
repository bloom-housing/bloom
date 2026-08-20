import React from "react"
import ApplicationsView, {
  ApplicationsIndexEnum,
} from "../../../../components/account/ApplicationsView"
import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { isFeatureFlagOn } from "../../../../lib/helpers"
import {
  fetchJurisdictionByName,
  fetchJurisdictionContent,
  fetchPublicOverrides,
} from "../../../../lib/hooks"

const ClosedApplications = ({ jurisdiction }: { jurisdiction: Jurisdiction }) => {
  return (
    <ApplicationsView
      filterType={ApplicationsIndexEnum.closed}
      enableApplicationStatus={isFeatureFlagOn(
        jurisdiction,
        FeatureFlagEnum.enableApplicationStatus
      )}
    />
  )
}

export default ClosedApplications

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
