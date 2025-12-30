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
    return featuresExist ? <ul className={"flex flex-wrap"}>{features}</ul> : <>{t("t.none")}</>
  }

  const enableAccessibilityFeatures = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableAccessibilityFeatures,
    listing.jurisdictions.id
  )

  const enableSmokingPolicyRadio = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableSmokingPolicyRadio,
    listing.jurisdictions.id
  )

  return (
    <SectionWithGrid heading={t("listings.sections.buildingFeaturesTitle")} inset>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="amenities" label={t("t.propertyAmenities")}>
            {getDetailFieldString(listing.amenities)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>

      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="unitAmenities" label={t("t.unitAmenities")}>
            {getDetailFieldString(listing.unitAmenities)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>

      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="accessibility" label={t("t.additionalAccessibility")}>
            {getDetailFieldString(listing.accessibility)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>

      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="petPolicy" label={t("t.petsPolicy")}>
            {getDetailFieldString(listing.petPolicy)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>

      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="servicesOffered" label={t("t.servicesOffered")}>
            {getDetailFieldString(listing.servicesOffered)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>

      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="smokingPolicy" label={t("t.smokingPolicy")}>
            {enableSmokingPolicyRadio
              ? listing.smokingPolicy || t("listings.smokingPolicyOptions.unknown")
              : getDetailFieldString(listing.smokingPolicy)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>

      {!enableAccessibilityFeatures ? null : (
        <Grid.Row>
          <Grid.Cell>
            <FieldValue id="accessibilityFeatures" label={"Accessibility Features"}>
              {getAccessibilityFeatures()}
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>
      )}
    </SectionWithGrid>
  )
}

export default DetailBuildingFeatures
