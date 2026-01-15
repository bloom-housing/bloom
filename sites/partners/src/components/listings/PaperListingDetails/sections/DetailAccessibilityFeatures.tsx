import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid, Heading } from "@bloom-housing/ui-seeds"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  AuthContext,
  listingFeatures,
  expandedAccessibilityFeatures,
} from "@bloom-housing/shared-helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { ListingContext } from "../../ListingContext"

const getAccessibilityFeatures = (featureSet: string[], listingFeatures: string[]) => {
  const filteredFeatures = listingFeatures.filter((feature) => featureSet.includes(feature))
  if (filteredFeatures.length === 0) return <>{t("t.none")}</>
  return filteredFeatures.map((feature) => {
    return (
      <li className={"list-disc mx-5 mb-1 w-full grow"} key={feature}>
        {t(`eligibility.accessibility.${feature}`)}
      </li>
    )
  })
}

export const getDetailAccessibilityFeatures = (listingFeatures: string[]) => {
  return Object.entries(expandedAccessibilityFeatures).map(([category, features]) => {
    return (
      <Grid.Row key={category} columns={1}>
        <Grid.Cell>
          <Heading priority={4} size={"md"} className={"seeds-p-b-4"}>
            {t(`eligibility.accessibility.categoryTitle.${category}`)}
          </Heading>
          {getAccessibilityFeatures(features, listingFeatures)}
        </Grid.Cell>
      </Grid.Row>
    )
  })
}

const DetailAccessibilityFeatures = () => {
  const listing = useContext(ListingContext)
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const enableAccessibilityFeatures = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableAccessibilityFeatures,
    listing.jurisdictions.id
  )

  const enableExpandedAccessibilityFeatures = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableExpandedAccessibilityFeatures,
    listing.jurisdictions.id
  )

  const featuresAsString = Object.keys(listing?.listingFeatures)
    .map((feature) => {
      return listing.listingFeatures[feature] === true ? feature : null
    })
    .filter((feature) => feature !== null)

  if (!enableAccessibilityFeatures && !enableExpandedAccessibilityFeatures) {
    return null
  }

  return (
    <SectionWithGrid heading={"Accessibility features"} inset>
      {enableExpandedAccessibilityFeatures ? (
        <div>
          <Heading priority={3} size={"lg"}>
            Accessibility features summary
          </Heading>
          {getDetailAccessibilityFeatures(featuresAsString)}
        </div>
      ) : (
        <Grid.Row>
          <Grid.Cell>
            <FieldValue id="accessibilityFeatures" label={"Accessibility Features"}>
              {getAccessibilityFeatures(listingFeatures, featuresAsString)}
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>
      )}
    </SectionWithGrid>
  )
}

export default DetailAccessibilityFeatures
