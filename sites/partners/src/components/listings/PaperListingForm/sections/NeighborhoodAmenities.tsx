import React, { useContext, useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { t, Textarea } from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  NeighborhoodAmenitiesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useJurisdiction } from "../../../../lib/hooks"

type AmenityConfig = {
  key: NeighborhoodAmenitiesEnum
  labelKey: string
  fieldName: string
}

const amenitiesConfig: AmenityConfig[] = [
  {
    key: NeighborhoodAmenitiesEnum.groceryStores,
    labelKey: "listings.amenities.groceryStores",
    fieldName: "listingNeighborhoodAmenities.groceryStores",
  },
  {
    key: NeighborhoodAmenitiesEnum.publicTransportation,
    labelKey: "listings.amenities.publicTransportation",
    fieldName: "listingNeighborhoodAmenities.publicTransportation",
  },
  {
    key: NeighborhoodAmenitiesEnum.schools,
    labelKey: "listings.amenities.schools",
    fieldName: "listingNeighborhoodAmenities.schools",
  },
  {
    key: NeighborhoodAmenitiesEnum.parksAndCommunityCenters,
    labelKey: "listings.amenities.parksAndCommunityCenters",
    fieldName: "listingNeighborhoodAmenities.parksAndCommunityCenters",
  },
  {
    key: NeighborhoodAmenitiesEnum.pharmacies,
    labelKey: "listings.amenities.pharmacies",
    fieldName: "listingNeighborhoodAmenities.pharmacies",
  },
  {
    key: NeighborhoodAmenitiesEnum.healthCareResources,
    labelKey: "listings.amenities.healthCareResources",
    fieldName: "listingNeighborhoodAmenities.healthCareResources",
  },
]

const NeighborhoodAmenities = () => {
  const formMethods = useFormContext()
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = formMethods
  const jurisdiction = watch("jurisdictions.id")

  const { data: jurisdictionData } = useJurisdiction(jurisdiction)

  const enableNeighborhoodAmenities = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableNeighborhoodAmenities,
    jurisdiction
  )

  const visibleAmenities = useMemo(() => {
    const visibleAmenitiesList = jurisdictionData?.visibleNeighborhoodAmenities || []
    return amenitiesConfig.filter((amenity) => visibleAmenitiesList.includes(amenity.key))
  }, [jurisdictionData?.visibleNeighborhoodAmenities])

  // Group amenities into rows of 2
  const amenityRows = useMemo(() => {
    const rows: AmenityConfig[][] = []
    for (let i = 0; i < visibleAmenities.length; i += 2) {
      rows.push(visibleAmenities.slice(i, i + 2))
    }
    return rows
  }, [visibleAmenities])

  if (!enableNeighborhoodAmenities) {
    return <></>
  }

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={t("listings.sections.neighborhoodAmenitiesTitle")}
        subheading={t("listings.sections.neighborhoodAmenitiesSubtitle")}
      >
        {amenityRows.map((row, rowIndex) => (
          <Grid.Row key={rowIndex} columns={2}>
            {row.map((amenity) => (
              <Grid.Cell key={amenity.key}>
                <Textarea
                  label={t(amenity.labelKey)}
                  name={amenity.fieldName}
                  id={amenity.fieldName}
                  fullWidth={true}
                  register={register}
                  placeholder={""}
                />
              </Grid.Cell>
            ))}
          </Grid.Row>
        ))}
      </SectionWithGrid>
    </>
  )
}

export default NeighborhoodAmenities
