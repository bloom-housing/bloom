import React, { useContext, useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { t, Textarea, Select } from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  NeighborhoodAmenitiesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useJurisdiction } from "../../../../lib/hooks"

enum NeighborhoodAmenityDistanceEnum {
  onSite = "onSite",
  oneBlock = "oneBlock",
  twoBlocks = "twoBlocks",
  threeBlocks = "threeBlocks",
  fourBlocks = "fourBlocks",
  fiveBlocks = "fiveBlocks",
  withinOneMile = "withinOneMile",
  withinTwoMiles = "withinTwoMiles",
  withinThreeMiles = "withinThreeMiles",
  withinFourMiles = "withinFourMiles",
}

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

  const enableNeighborhoodAmenitiesDropdown = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableNeighborhoodAmenitiesDropdown,
    jurisdiction
  )

  const neighborhoodAmenityOptions = [
    "",
    ...Object.values(NeighborhoodAmenityDistanceEnum).map((val) => {
      return {
        value: t(`neighborhoodAmenities.distance.${val}`),
        label: t(`neighborhoodAmenities.distance.${val}`),
      }
    }),
  ]

  const visibleAmenities = useMemo(() => {
    const visibleAmenitiesList = jurisdictionData?.visibleNeighborhoodAmenities || []
    return Object.values(NeighborhoodAmenitiesEnum).filter((amenity) =>
      visibleAmenitiesList.includes(amenity)
    )
  }, [jurisdictionData?.visibleNeighborhoodAmenities])

  // Group amenities into rows of 2
  const amenityRows = useMemo(() => {
    const rows: NeighborhoodAmenitiesEnum[][] = []
    for (let i = 0; i < visibleAmenities.length; i += 2) {
      rows.push(visibleAmenities.slice(i, i + 2))
    }
    return rows
  }, [visibleAmenities])

  if (!enableNeighborhoodAmenities || !jurisdiction) {
    return <></>
  }

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={t("listings.sections.neighborhoodAmenitiesTitle")}
        subheading={
          enableNeighborhoodAmenitiesDropdown
            ? t("listings.sections.neighborhoodAmenitiesSubtitleAlt")
            : t("listings.sections.neighborhoodAmenitiesSubtitle")
        }
      >
        {amenityRows.map((row, rowIndex) => (
          <Grid.Row key={rowIndex} columns={2}>
            {row.map((amenity) => (
              <Grid.Cell key={amenity}>
                {enableNeighborhoodAmenitiesDropdown ? (
                  <Select
                    id={`listingNeighborhoodAmenities.${amenity}`}
                    name={`listingNeighborhoodAmenities.${amenity}`}
                    label={t(`listings.amenities.${amenity}`)}
                    register={register}
                    options={neighborhoodAmenityOptions}
                    controlClassName="control"
                  />
                ) : (
                  <Textarea
                    label={t(`listings.amenities.${amenity}`)}
                    name={`listingNeighborhoodAmenities.${amenity}`}
                    id={`listingNeighborhoodAmenities.${amenity}`}
                    fullWidth={true}
                    register={register}
                    placeholder={""}
                  />
                )}
              </Grid.Cell>
            ))}
          </Grid.Row>
        ))}
      </SectionWithGrid>
    </>
  )
}

export default NeighborhoodAmenities
