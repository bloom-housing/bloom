import React, { useContext } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { ViewItem } from "../../../../../../detroit-ui-components/src/blocks/ViewItem"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"

const DetailBuildingFeatures = () => {
  const listing = useContext(ListingContext)

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

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.buildingFeaturesTitle")}
      grid={false}
      inset
    >
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="amenities" label={t("t.propertyAmenities")}>
            {getDetailFieldString(listing.amenities)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="unitAmenities" label={t("t.unitAmenities")}>
            {getDetailFieldString(listing.unitAmenities)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="accessibility" label={t("t.additionalAccessibility")}>
            {getDetailFieldString(listing.accessibility)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="smokingPolicy" label={t("t.smokingPolicy")}>
            {getDetailFieldString(listing.smokingPolicy)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="petPolicy" label={t("t.petsPolicy")}>
            {getDetailFieldString(listing.petPolicy)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="servicesOffered" label={t("t.servicesOffered")}>
            {getDetailFieldString(listing.servicesOffered)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell className={"m-h-1"}>
          <ViewItem label={"Accessibility Features"}>
            <ul className={"flex flex-wrap"}>{getAccessibilityFeatures()}</ul>
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailBuildingFeatures
