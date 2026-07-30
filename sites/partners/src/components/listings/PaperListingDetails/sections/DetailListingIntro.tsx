import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import {
  EnumListingListingType,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AuthContext } from "@bloom-housing/shared-helpers"

const DetailListingIntro = () => {
  const listing = useContext(ListingContext)
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const enableHousingDeveloperOwner = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableHousingDeveloperOwner,
    listing.jurisdictions.id
  )
  const enableListingFileNumber = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableListingFileNumber,
    listing.jurisdictions.id
  )

  const enableNonRegulatedListings = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableNonRegulatedListings,
    listing.jurisdictions.id
  )

  const enableLandUse = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableLandUse,
    listing.jurisdictions.id
  )

  const enableProperties = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableProperties,
    listing.jurisdictions.id
  )

  let developerFieldTitle = t("listings.developer")
  if (enableHousingDeveloperOwner) {
    developerFieldTitle = t("listings.housingDeveloperOwner")
  } else if (listing.listingType === EnumListingListingType.nonRegulated) {
    developerFieldTitle = t("listings.propertyManager")
  } else {
    developerFieldTitle = t("listings.developer")
  }

  const getListingTypeLabel = () => {
    if (listing.listingType === EnumListingListingType.landUse) {
      return t("listings.landUse")
    } else if (listing.listingType === EnumListingListingType.nonRegulated) {
      return t("listings.nonRegulated")
    }
    return t("listings.regulated")
  }

  return (
    <SectionWithGrid heading={t("listings.sections.introTitle")} inset>
      {enableListingFileNumber && (
        <Grid.Row>
          <Grid.Cell>
            <FieldValue id="listingFileNumber" label={t("listings.listingFileNumber")}>
              {getDetailFieldString(listing.listingFileNumber)}
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>
      )}
      {(enableNonRegulatedListings || enableLandUse) && (
        <Grid.Row>
          <Grid.Cell>
            <FieldValue id="listingType" label={t("listings.listingTypeTitle")}>
              {getListingTypeLabel()}
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>
      )}
      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="name" label={t("listings.listingName")}>
            {getDetailFieldString(listing.name)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="developer" label={developerFieldTitle}>
            {getDetailFieldString(listing.developer)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
      {enableNonRegulatedListings &&
        listing.listingType === EnumListingListingType.nonRegulated && (
          <Grid.Row>
            <Grid.Cell>
              <FieldValue id="hasHudEbllClearance" label={t("listings.hasEbllClearanceTitle")}>
                {listing.hasHudEbllClearance ? t("t.yes") : t("t.no")}
              </FieldValue>
            </Grid.Cell>
          </Grid.Row>
        )}
      {enableProperties && (
        <Grid.Row>
          <Grid.Cell>
            <FieldValue id="property" label={t("properties.drawer.nameLabel")}>
              {getDetailFieldString(listing.property?.name)}
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>
      )}
    </SectionWithGrid>
  )
}

export default DetailListingIntro
