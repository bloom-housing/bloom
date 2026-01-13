import React from "react"
import ApplicationsView, {
  ApplicationsIndexEnum,
} from "../../../../components/account/ApplicationsView"
import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { isFeatureFlagOn } from "../../../../lib/helpers"
import { fetchJurisdictionByName } from "../../../../lib/hooks"

const OpenApplications = ({ jurisdiction }: { jurisdiction: Jurisdiction }) => {
  return (
    <ApplicationsView
      filterType={ApplicationsIndexEnum.open}
      enableApplicationStatus={isFeatureFlagOn(
        jurisdiction,
        FeatureFlagEnum.enableApplicationStatus
      )}
    />
  )
}

export default OpenApplications

export async function getStaticProps() {
  const jurisdiction = await fetchJurisdictionByName()

  return {
    props: { jurisdiction },
  }
}
