import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, Textarea } from "@bloom-housing/ui-components"

const NeighborhoodAmenities = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <div>
      <GridSection
        grid={false}
        separator
        title={t("listings.sections.neighborhoodAmenitiesTitle")}
        description={t("listings.sections.neighborhoodAmenitiesSubtitle")}
      >
        <GridSection columns={2}>
          <Textarea
            label={t("listings.amenities.groceryStores")}
            name={"neighborhoodAmenities.groceryStores"}
            id={"neighborhoodAmenities.groceryStores"}
            fullWidth={true}
            register={register}
          />
          <Textarea
            label={t("listings.amenities.publicTransportation")}
            name={"neighborhoodAmenities.publicTransportation"}
            id={"neighborhoodAmenities.publicTransportation"}
            fullWidth={true}
            register={register}
          />
        </GridSection>
        <GridSection columns={2}>
          <Textarea
            label={t("listings.amenities.schools")}
            name={"neighborhoodAmenities.schools"}
            id={"neighborhoodAmenities.schools"}
            fullWidth={true}
            register={register}
          />
          <Textarea
            label={t("listings.amenities.parksAndCommunityCenters")}
            name={"neighborhoodAmenities.parksAndCommunityCenters"}
            id={"neighborhoodAmenities.parksAndCommunityCenters"}
            fullWidth={true}
            register={register}
          />
        </GridSection>
        <GridSection columns={2}>
          <Textarea
            label={t("listings.amenities.pharmacies")}
            name={"neighborhoodAmenities.pharmacies"}
            id={"neighborhoodAmenities.pharmacies"}
            fullWidth={true}
            register={register}
          />
          <Textarea
            label={t("listings.amenities.healthCareResources")}
            name={"neighborhoodAmenities.healthCareResources"}
            id={"neighborhoodAmenities.healthCareResources"}
            fullWidth={true}
            register={register}
          />
        </GridSection>
      </GridSection>
    </div>
  )
}

export default NeighborhoodAmenities
