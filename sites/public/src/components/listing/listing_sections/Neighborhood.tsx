import * as React from "react"
import { ListingMap, t } from "@bloom-housing/ui-components"
import { HeadingGroup, Link } from "@bloom-housing/ui-seeds"
import { oneLineAddress } from "@bloom-housing/shared-helpers"
import {
  Address,
  FeatureFlagEnum,
  Jurisdiction,
  ListingNeighborhoodAmenities,
  NeighborhoodAmenitiesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { getGenericAddress, isFeatureFlagOn } from "../../../lib/helpers"
import { CollapsibleSection } from "../../../patterns/CollapsibleSection"
import styles from "../ListingViewSeeds.module.scss"

type NeighborhoodProps = {
  address: Address
  name: string
  neighborhood?: string
  neighborhoodAmenities?: ListingNeighborhoodAmenities
  region?: string
  visibleNeighborhoodAmenities?: NeighborhoodAmenitiesEnum[]
  jurisdiction?: Jurisdiction
}

export const Neighborhood = ({
  address,
  name,
  neighborhood,
  neighborhoodAmenities,
  region,
  visibleNeighborhoodAmenities = [],
  jurisdiction,
}: NeighborhoodProps) => {
  const googleMapsHref = "https://www.google.com/maps/place/" + oneLineAddress(address)

  const enableNeighborhoodAmenitiesDropdown = isFeatureFlagOn(
    jurisdiction,
    FeatureFlagEnum.enableNeighborhoodAmenitiesDropdown
  )

  const isAmenityVisible = (amenity: string) =>
    visibleNeighborhoodAmenities.includes(amenity as NeighborhoodAmenitiesEnum)

  const hasNeighborhoodAmenities = neighborhoodAmenities
    ? Object.keys(neighborhoodAmenities).some(
        (key) =>
          neighborhoodAmenities[key] !== null &&
          neighborhoodAmenities[key] !== undefined &&
          isAmenityVisible(key)
      )
    : null

  const showSection = address || neighborhood || region || hasNeighborhoodAmenities
  if (!showSection) return null

  return (
    <CollapsibleSection
      title={t("t.neighborhood")}
      subtitle={t("listings.sections.neighborhoodSubtitle")}
      priority={2}
    >
      <div className={`${styles["mobile-inline-collapse-padding"]} seeds-m-bs-section`}>
        {address && (
          <>
            <ListingMap address={getGenericAddress(address)} listingName={name} />
            <Link href={googleMapsHref} newWindowTarget={true} className={"seeds-m-bs-4"}>
              {t("t.getDirections")}
            </Link>
          </>
        )}
        {neighborhood && (
          <HeadingGroup
            heading={t("t.neighborhood")}
            subheading={neighborhood}
            size={"lg"}
            headingPriority={3}
            className={`${styles["heading-group"]} seeds-m-bs-section`}
          />
        )}
        {region && (
          <HeadingGroup
            heading={t("t.region")}
            subheading={region}
            size={"lg"}
            headingPriority={3}
            className={`${styles["heading-group"]} seeds-m-bs-section`}
          />
        )}
        {hasNeighborhoodAmenities && (
          <>
            <HeadingGroup
              heading={
                enableNeighborhoodAmenitiesDropdown
                  ? t("listings.sections.neighborhoodAmenitiesTitleAlt")
                  : t("listings.sections.neighborhoodAmenitiesTitle")
              }
              subheading={
                enableNeighborhoodAmenitiesDropdown
                  ? t("listings.sections.neighborhoodAmenitiesSubtitleAlt")
                  : t("listings.sections.neighborhoodAmenitiesSubtitle")
              }
              size={"lg"}
              headingPriority={3}
              className={`${styles["heading-group"]} seeds-m-bs-section`}
            />
            {Object.keys(neighborhoodAmenities).map((amenity, index) => {
              if (!neighborhoodAmenities[amenity] || !isAmenityVisible(amenity)) return
              return (
                <HeadingGroup
                  heading={t(`listings.amenities.${amenity}`)}
                  subheading={neighborhoodAmenities[amenity]}
                  size={"lg"}
                  headingPriority={4}
                  className={`${styles["heading-group"]} ${styles["nested-heading-group"]} seeds-m-bs-content`}
                  key={index}
                />
              )
            })}
          </>
        )}
      </div>
    </CollapsibleSection>
  )
}
