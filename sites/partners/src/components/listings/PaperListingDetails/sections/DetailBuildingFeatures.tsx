import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"
import { AuthContext } from "@bloom-housing/shared-helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const DetailBuildingFeatures = () => {
  const listing = useContext(ListingContext)
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const getAccessibilityFeatures = () => {
    let featuresExist = false
    const features = Object.keys(listing?.listingFeatures ?? {}).map((feature) => {
      if (listing?.listingFeatures[feature]) {
        featuresExist = true
        return (
          <li className={"list-disc mx-5 mb-1 md:w-1/3 w-full grow"} key={feature}>
            {t(`eligibility.accessibility.${feature}`)}
          </li>
        )
      }
    })
    return featuresExist ? features : <>{t("t.none")}</>
  }

  const enableAccessibilityFeatures = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableAccessibilityFeatures,
    listing.jurisdictions.id
  )

  return (
    <SectionWithGrid heading={t("listings.sections.buildingFeaturesTitle")} inset>
      <Grid.Row>
        <FieldValue id="amenities" label={t("t.propertyAmenities")}>
          {getDetailFieldString(listing.amenities)}
        </FieldValue>
      </Grid.Row>

      <Grid.Row>
        <FieldValue id="unitAmenities" label={t("t.unitAmenities")}>
          {getDetailFieldString(listing.unitAmenities)}
        </FieldValue>
      </Grid.Row>

      <Grid.Row>
        <FieldValue id="accessibility" label={t("t.additionalAccessibility")}>
          {getDetailFieldString(listing.accessibility)}
        </FieldValue>
      </Grid.Row>

      <Grid.Row>
        <FieldValue id="smokingPolicy" label={t("t.smokingPolicy")}>
          {getDetailFieldString(listing.smokingPolicy)}
        </FieldValue>
      </Grid.Row>

      <Grid.Row>
        <FieldValue id="petPolicy" label={t("t.petsPolicy")}>
          {getDetailFieldString(listing.petPolicy)}
        </FieldValue>
      </Grid.Row>

      <Grid.Row>
        <FieldValue id="servicesOffered" label={t("t.servicesOffered")}>
          {getDetailFieldString(listing.servicesOffered)}
        </FieldValue>
      </Grid.Row>

      {!enableAccessibilityFeatures ? null : (
        <Grid.Row>
          <FieldValue id="accessibilityFeatures" label={"Accessibility Features"}>
            <ul className={"flex flex-wrap"}>{getAccessibilityFeatures()}</ul>
          </FieldValue>
        </Grid.Row>
      )}
    </SectionWithGrid>
  )
}

export default DetailBuildingFeatures
