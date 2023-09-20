import React, { useMemo, useContext } from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, Textarea, FieldGroup, GridCell } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { listingFeatures, AuthContext } from "@bloom-housing/shared-helpers"
import { ListingFeatures } from "@bloom-housing/backend-core/types"

type BuildingFeaturesProps = {
  existingFeatures: ListingFeatures
}

const BuildingFeatures = (props: BuildingFeaturesProps) => {
  const formMethods = useFormContext()
  const { profile } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = formMethods
  const jurisdiction = watch("jurisdiction.id")

  const featureOptions = useMemo(() => {
    return listingFeatures.map((item) => ({
      id: item,
      label: t(`eligibility.accessibility.${item}`),
      defaultChecked: props.existingFeatures ? props.existingFeatures[item] : false,
      register,
    }))
  }, [register, props.existingFeatures])

  const enableAccessibilityFeatures = profile?.jurisdictions?.find(
    (j) => j.id === jurisdiction
  )?.enableAccessibilityFeatures

  return (
    <div>
      <GridSection
        columns={2}
        separator
        title={t("listings.sections.buildingFeaturesTitle")}
        description={t("listings.sections.buildingFeaturesSubtitle")}
      >
        <GridCell>
          <Textarea
            label={t("t.propertyAmenities")}
            name={"amenities"}
            id={"amenities"}
            fullWidth={true}
            register={register}
            maxLength={600}
          />
        </GridCell>
        <GridCell>
          <Textarea
            label={t("t.additionalAccessibility")}
            name={"accessibility"}
            id={"accessibility"}
            fullWidth={true}
            register={register}
            maxLength={600}
          />
        </GridCell>
        <GridCell>
          <Textarea
            label={t("t.unitAmenities")}
            name={"unitAmenities"}
            id={"unitAmenities"}
            fullWidth={true}
            register={register}
            maxLength={600}
          />
        </GridCell>
        <GridCell>
          <Textarea
            label={t("t.smokingPolicy")}
            name={"smokingPolicy"}
            id={"smokingPolicy"}
            fullWidth={true}
            register={register}
            maxLength={600}
          />
        </GridCell>
        <GridCell>
          <Textarea
            label={t("t.petsPolicy")}
            name={"petPolicy"}
            id={"petPolicy"}
            fullWidth={true}
            register={register}
            maxLength={600}
          />
        </GridCell>
        <GridCell>
          <Textarea
            label={t("t.servicesOffered")}
            name={"servicesOffered"}
            id={"servicesOffered"}
            fullWidth={true}
            register={register}
            maxLength={600}
          />
        </GridCell>
        {!enableAccessibilityFeatures ? null : (
          <GridCell span={2}>
            <FieldValue label={t("listings.sections.accessibilityFeatures")}>
              <FieldGroup
                type="checkbox"
                name="listingFeatures"
                fields={featureOptions}
                register={register}
                fieldGroupClassName="grid grid-cols-3 mt-4"
              />
            </FieldValue>
          </GridCell>
        )}
      </GridSection>
    </div>
  )
}

export default BuildingFeatures
