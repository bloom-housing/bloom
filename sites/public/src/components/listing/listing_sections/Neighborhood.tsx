import * as React from "react"
import { ListingMap, t } from "@bloom-housing/ui-components"
import { HeadingGroup, Link } from "@bloom-housing/ui-seeds"
import { oneLineAddress } from "@bloom-housing/shared-helpers"
import {
  Address,
  ListingNeighborhoodAmenities,
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
}

export const Neighborhood = ({
  address,
  name,
  neighborhood,
  neighborhoodAmenities,
  region,
}: NeighborhoodProps) => {
  const googleMapsHref = "https://www.google.com/maps/place/" + oneLineAddress(address)
  const hasNeighborhoodAmenities = Object.values(neighborhoodAmenities).some(
    (value) => value !== null && value !== undefined
  )

  return (
    <CollapsibleSection
      title={t("t.neighborhood")}
      subtitle={t("listings.sections.neighborhoodSubtitle")}
      priority={2}
    >
      <div className={`${styles["mobile-inline-collapse-padding"]} seeds-m-bs-section`}>
        <ListingMap address={getGenericAddress(address)} listingName={name} />
        <Link href={googleMapsHref} newWindowTarget={true} className={"seeds-m-bs-4"}>
          {t("t.getDirections")}
        </Link>
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
              heading={t("listings.sections.neighborhoodAmenitiesTitle")}
              subheading={t("listings.sections.neighborhoodAmenitiesSubtitle")}
              size={"lg"}
              headingPriority={3}
              className={`${styles["heading-group"]} seeds-m-bs-section`}
            />
            {Object.keys(neighborhoodAmenities).map((amenity) => {
              if (!neighborhoodAmenities[amenity]) return
              return (
                <HeadingGroup
                  heading={t(`listings.amenities.${amenity}`)}
                  subheading={neighborhoodAmenities[amenity]}
                  size={"lg"}
                  headingPriority={4}
                  className={`${styles["heading-group"]} ${styles["nested-heading-group"]} seeds-m-bs-content`}
                />
              )
            })}
          </>
        )}
      </div>
    </CollapsibleSection>
  )
}
