import React, { useContext } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"
import { AuthContext } from "@bloom-housing/shared-helpers"

const DetailBuildingFeatures = () => {
  const listing = useContext(ListingContext)
  const { profile } = useContext(AuthContext)

  const getAccessibilityFeatures = () => {
    let featuresExist = false
    const features = Object.keys(listing?.features ?? {}).map((feature) => {
      if (listing?.features[feature]) {
        featuresExist = true
        return (
          <li className={"list-disc mx-5 mb-1 md:w-1/3 w-full grow"}>
            {t(`eligibility.accessibility.${feature}`)}
          </li>
        )
      }
    })
    return featuresExist ? features : <>{t("t.none")}</>
  }

  const enableAccessibilityFeatures = profile?.jurisdictions?.find(
    (j) => j.id === listing.jurisdiction.id
  )?.enableAccessibilityFeatures

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.buildingFeaturesTitle")}
      grid={false}
      inset
    >
      <GridSection columns={1}>
        <GridCell>
          <FieldValue id="amenities" label={t("t.propertyAmenities")}>
            {getDetailFieldString(listing.amenities)}
          </FieldValue>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <FieldValue id="unitAmenities" label={t("t.unitAmenities")}>
            {getDetailFieldString(listing.unitAmenities)}
          </FieldValue>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <FieldValue id="accessibility" label={t("t.additionalAccessibility")}>
            {getDetailFieldString(listing.accessibility)}
          </FieldValue>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <FieldValue id="smokingPolicy" label={t("t.smokingPolicy")}>
            {getDetailFieldString(listing.smokingPolicy)}
          </FieldValue>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <FieldValue id="petPolicy" label={t("t.petsPolicy")}>
            {getDetailFieldString(listing.petPolicy)}
          </FieldValue>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <FieldValue id="servicesOffered" label={t("t.servicesOffered")}>
            {getDetailFieldString(listing.servicesOffered)}
          </FieldValue>
        </GridCell>
      </GridSection>
      {!enableAccessibilityFeatures ? null : (
        <GridSection columns={1}>
          <GridCell className={"m-h-1"}>
            <FieldValue label={"Accessibility Features"}>
              <ul className={"flex flex-wrap"}>{getAccessibilityFeatures()}</ul>
            </FieldValue>
          </GridCell>
        </GridSection>
      )}
    </GridSection>
  )
}

export default DetailBuildingFeatures
