import React, { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, Textarea, ViewItem, FieldGroup } from "@bloom-housing/ui-components"
import { listingFeatures } from "@bloom-housing/shared-helpers"
import { ListingFeatures } from "@bloom-housing/backend-core/types"

type BuildingFeaturesProps = {
  existingFeatures: ListingFeatures
}

const BuildingFeatures = (props: BuildingFeaturesProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  const featureOptions = useMemo(() => {
    return listingFeatures.map((item) => ({
      id: item,
      label: t(`eligibility.accessibility.${item}`),
      defaultChecked: props.existingFeatures ? props.existingFeatures[item] : false,
      register,
    }))
  }, [register])

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
            maxLength={600}
          />
          <Textarea
            label={t("t.additionalAccessibility")}
            name={"accessibility"}
            id={"accessibility"}
            fullWidth={true}
            register={register}
            maxLength={600}
          />
        </GridSection>
        <GridSection columns={2}>
          <Textarea
            label={t("t.unitAmenities")}
            name={"unitAmenities"}
            id={"unitAmenities"}
            fullWidth={true}
            register={register}
            maxLength={600}
          />
          <Textarea
            label={t("t.smokingPolicy")}
            name={"smokingPolicy"}
            id={"smokingPolicy"}
            fullWidth={true}
            register={register}
            maxLength={600}
          />
        </GridSection>
        <GridSection columns={2}>
          <Textarea
            label={t("t.petsPolicy")}
            name={"petPolicy"}
            id={"petPolicy"}
            fullWidth={true}
            register={register}
            maxLength={600}
          />
          <Textarea
            label={t("t.servicesOffered")}
            name={"servicesOffered"}
            id={"servicesOffered"}
            fullWidth={true}
            register={register}
            maxLength={600}
          />
        </GridSection>
        <GridSection columns={1}>
          <ViewItem label={"Accessibility Features"}>
            <FieldGroup
              type="checkbox"
              name="listingFeatures"
              fields={featureOptions}
              register={register}
              fieldGroupClassName="grid grid-cols-3 mt-4"
            />
          </ViewItem>
        </GridSection>
      </GridSection>
    </div>
  )
}

export default BuildingFeatures
