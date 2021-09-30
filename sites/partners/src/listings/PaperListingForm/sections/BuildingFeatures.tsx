import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, Textarea } from "@bloom-housing/ui-components"

const BuildingFeatures = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <div>
      <GridSection
        grid={false}
        separator
        title={t("listings.sections.buildingFeaturesTitle")}
        description={t("listings.sections.buildingFeaturesSubtitle")}
      >
        <GridSection columns={2}>
          <Textarea
            label={t("t.propertyAmenities")}
            name={"amenities"}
            id={"amenities"}
            fullWidth={true}
            register={register}
            maxLength={1000}
          />
          <Textarea
            label={t("t.accessibility")}
            name={"accessibility"}
            id={"accessibility"}
            fullWidth={true}
            register={register}
            maxLength={1000}
          />
        </GridSection>
        <GridSection columns={2}>
          <Textarea
            label={t("t.unitAmenities")}
            name={"unitAmenities"}
            id={"unitAmenities"}
            fullWidth={true}
            register={register}
            maxLength={1000}
          />
          <Textarea
            label={t("t.smokingPolicy")}
            name={"smokingPolicy"}
            id={"smokingPolicy"}
            fullWidth={true}
            register={register}
            maxLength={1000}
          />
        </GridSection>
        <GridSection columns={2}>
          <Textarea
            label={t("t.petsPolicy")}
            name={"petPolicy"}
            id={"petPolicy"}
            fullWidth={true}
            register={register}
            maxLength={1000}
          />
          <Textarea
            label={t("t.servicesOffered")}
            name={"servicesOffered"}
            id={"servicesOffered"}
            fullWidth={true}
            register={register}
            maxLength={1000}
          />
        </GridSection>
      </GridSection>
    </div>
  )
}

export default BuildingFeatures
