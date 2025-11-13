import * as React from "react"
import { t } from "@bloom-housing/ui-components"
import { HeadingGroup, Link } from "@bloom-housing/ui-seeds"
import { oneLineAddress, Map } from "@bloom-housing/shared-helpers"
import {
  Address,
  ListingNeighborhoodAmenities,
  NeighborhoodAmenitiesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { getGenericAddress } from "../../../lib/helpers"
import { CollapsibleSection } from "../../../patterns/CollapsibleSection"
import styles from "../ListingViewSeeds.module.scss"

type NeighborhoodProps = {
  address: Address
  name: string
  neighborhood?: string
  neighborhoodAmenities?: ListingNeighborhoodAmenities
  region?: string
  visibleNeighborhoodAmenities?: NeighborhoodAmenitiesEnum[]
}

export const Neighborhood = ({
  address,
  name,
  neighborhood,
  neighborhoodAmenities,
  region,
  visibleNeighborhoodAmenities = [],
}: NeighborhoodProps) => {
  const googleMapsHref = "https://www.google.com/maps/place/" + oneLineAddress(address)

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
            <Map address={getGenericAddress(address)} listingName={name} />
            <Link href={googleMapsHref} newWindowTarget={true} className={"seeds-m-bs-4"}>
              {t("t.getDirections")}
            </Link>
          </>
        )}
        {neighborhood && (
          <HeadingGroup
            heading={t("t.neighborhood")}
            subheading={neighborhood}
            headingProps={{ priority: 3, size: "lg" }}
            className={`${styles["heading-group"]} seeds-m-bs-section`}
          />
        )}
        {region && (
          <HeadingGroup
            heading={t("t.region")}
            subheading={region}
            headingProps={{ priorty: 3, size: "lg" }}
            className={`${styles["heading-group"]} seeds-m-bs-section`}
          />
        )}
        {hasNeighborhoodAmenities && (
          <>
            <HeadingGroup
              heading={t("listings.sections.neighborhoodAmenitiesTitle")}
              subheading={t("listings.sections.neighborhoodAmenitiesSubtitle")}
              headingProps={{ priority: 3, size: "lg" }}
              className={`${styles["heading-group"]} seeds-m-bs-section`}
            />
            {Object.keys(neighborhoodAmenities).map((amenity, index) => {
              if (!neighborhoodAmenities[amenity] || !isAmenityVisible(amenity)) return
              return (
                <HeadingGroup
                  heading={t(`listings.amenities.${amenity}`)}
                  subheading={neighborhoodAmenities[amenity]}
                  headingProps={{ priority: 4, size: "lg" }}
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
