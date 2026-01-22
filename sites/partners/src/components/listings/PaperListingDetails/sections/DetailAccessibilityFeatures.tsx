import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid, Heading } from "@bloom-housing/ui-seeds"
import {
  FeatureFlagEnum,
  ListingFeaturesConfiguration,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AuthContext } from "@bloom-housing/shared-helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { ListingContext } from "../../ListingContext"
import styles from "../../PaperListingForm/ListingForm.module.scss"

const getAccessibilityFeaturesList = (possibleFeatures: string[], listingFeatures: string[]) => {
  const filteredFeatures = possibleFeatures?.filter((field) => listingFeatures.includes(field))
  if (!filteredFeatures || filteredFeatures.length === 0) return <>{t("t.none")}</>
  const listItems = filteredFeatures?.map((feature) => {
    return <li key={feature}>{t(`eligibility.accessibility.${feature}`)}</li>
  })
  return (
    <ul className={`${styles["list-style"]}`} data-testid="accessibility-features-list">
      {listItems}
    </ul>
  )
}

export const getExpandedAccessibilityFeatures = (
  listingFeatures: string[],
  configuration: ListingFeaturesConfiguration
) => {
  return configuration?.categories.map((category) => {
    return (
      <Grid.Row key={category.id} className={styles["text-on-secondary"]}>
        <Grid.Cell>
          <div data-testid={`accessibility-features-${category.id}`}>
            <Heading size={"md"} className={"seeds-p-b-4"} priority={4}>
              {t(`eligibility.accessibility.categoryTitle.${category.id}`)}
            </Heading>
            {getAccessibilityFeaturesList(
              category.fields.map((feature) => {
                return feature.id
              }),
              listingFeatures
            )}
          </div>
        </Grid.Cell>
      </Grid.Row>
    )
  })
}

type DetailAccessibilityFeaturesProps = {
  listingFeaturesConfiguration: ListingFeaturesConfiguration
}

const DetailAccessibilityFeatures = (props: DetailAccessibilityFeaturesProps) => {
  const listing = useContext(ListingContext)
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const enableAccessibilityFeatures = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableAccessibilityFeatures,
    listing.jurisdictions.id
  )

  const hasCategories = props?.listingFeaturesConfiguration?.categories?.length > 0

  const featuresAsString = Object.keys(listing?.listingFeatures)
    .map((feature) => {
      return listing.listingFeatures[feature] === true ? feature : null
    })
    .filter((feature) => feature !== null)

  if (!enableAccessibilityFeatures) {
    return null
  }

  return (
    <SectionWithGrid heading={t("listings.sections.accessibilityFeatures")} inset>
      {hasCategories ? (
        <div>
          <Heading priority={3} size={"lg"}>
            {t("accessibility.summaryTitle")}
          </Heading>
          {getExpandedAccessibilityFeatures(featuresAsString, props?.listingFeaturesConfiguration)}
        </div>
      ) : (
        <Grid.Row>
          <Grid.Cell>
            <FieldValue
              id="accessibilityFeatures"
              label={t("listings.sections.accessibilityFeatures")}
            >
              {getAccessibilityFeaturesList(
                props?.listingFeaturesConfiguration?.fields.map((feature) => feature.id),
                featuresAsString
              )}
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>
      )}
    </SectionWithGrid>
  )
}

export default DetailAccessibilityFeatures
