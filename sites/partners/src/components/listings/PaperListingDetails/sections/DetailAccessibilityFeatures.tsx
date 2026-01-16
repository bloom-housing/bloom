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
import styles from "../../PaperListingForm/ListingForm.module.scss"

const getAccessibilityFeatures = (featureSet: string[], listingFeatures: string[]) => {
  const filteredFeatures = listingFeatures.filter((feature) => featureSet.includes(feature))
  if (filteredFeatures.length === 0) return <>{t("t.none")}</>
  const listItems = filteredFeatures.map((feature) => {
    return <li key={feature}>{t(`eligibility.accessibility.${feature}`)}</li>
  })
  return <ul className={`${styles["list-style"]}`}>{listItems}</ul>
}

export const getDetailAccessibilityFeatures = (listingFeatures: string[]) => {
  return Object.entries(expandedAccessibilityFeatures).map(([category, features]) => {
    return (
      <Grid.Row key={category} className={styles["text-on-secondary"]}>
        <Grid.Cell>
          <Heading size={"md"} className={"seeds-p-b-4"}>
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

  console.log({ listingFeatures })

  return (
    <SectionWithGrid heading={t("listings.sections.accessibilityFeatures")} inset>
      {enableExpandedAccessibilityFeatures ? (
        <div>
          <Heading priority={3} size={"lg"}>
            {t("accessibility.summaryTitle")}
          </Heading>
          {getDetailAccessibilityFeatures(featuresAsString)}
        </div>
      ) : (
        <Grid.Row>
          <Grid.Cell>
            <FieldValue
              id="accessibilityFeatures"
              label={t("listings.sections.accessibilityFeatures")}
            >
              {getAccessibilityFeatures(listingFeatures, featuresAsString)}
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>
      )}
    </SectionWithGrid>
  )
}

export default DetailAccessibilityFeatures
