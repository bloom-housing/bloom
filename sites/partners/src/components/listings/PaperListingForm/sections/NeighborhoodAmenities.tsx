import React, { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { t, Textarea, Select } from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import { NeighborhoodAmenitiesEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"

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

type NeighborhoodAmenitiesProps = {
  enableNeighborhoodAmenities?: boolean
  enableNeighborhoodAmenitiesDropdown?: boolean
  visibleNeighborhoodAmenities: NeighborhoodAmenitiesEnum[]
}

const NeighborhoodAmenities = (props: NeighborhoodAmenitiesProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  const neighborhoodAmenityOptions = [
    "",
    ...Object.values(NeighborhoodAmenityDistanceEnum).map((val) => {
      return {
        value: t(`neighborhoodAmenities.distance.${val}`),
        label: t(`neighborhoodAmenities.distance.${val}`),
      }
    }),
  ]

  const visibleAmenities = Object.values(NeighborhoodAmenitiesEnum).filter((amenity) =>
    props.visibleNeighborhoodAmenities?.includes(amenity)
  )

  // Group amenities into rows of 2
  const amenityRows = useMemo(() => {
    const rows: NeighborhoodAmenitiesEnum[][] = []
    for (let i = 0; i < visibleAmenities.length; i += 2) {
      rows.push(visibleAmenities.slice(i, i + 2))
    }
    return rows
  }, [visibleAmenities])

  if (!props.enableNeighborhoodAmenities) {
    return <></>
  }

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={t("listings.sections.neighborhoodAmenitiesTitle")}
        subheading={
          props.enableNeighborhoodAmenitiesDropdown
            ? t("listings.sections.neighborhoodAmenitiesSubtitleAlt")
            : t("listings.sections.neighborhoodAmenitiesSubtitle")
        }
      >
        {amenityRows.map((row, rowIndex) => (
          <Grid.Row key={rowIndex} columns={2}>
            {row.map((amenity) => (
              <Grid.Cell key={amenity}>
                {props.enableNeighborhoodAmenitiesDropdown ? (
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
