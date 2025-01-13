import React, { useMemo, useContext, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { t, Textarea, FieldGroup } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { listingFeatures, AuthContext } from "@bloom-housing/shared-helpers"
import { ListingFeatures } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type BuildingFeaturesProps = {
  existingFeatures: ListingFeatures
}

const BuildingFeatures = (props: BuildingFeaturesProps) => {
  const formMethods = useFormContext()
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, setValue } = formMethods
  const jurisdiction = watch("jurisdictions.id")

  const featureOptions = useMemo(() => {
    return listingFeatures.map((item) => ({
      id: item,
      label: t(`eligibility.accessibility.${item}`),
      defaultChecked: props.existingFeatures ? props.existingFeatures[item] : false,
      register,
    }))
  }, [register, props.existingFeatures])

  const enableAccessibilityFeatures = doJurisdictionsHaveFeatureFlagOn(
    "enableAccessibilityFeatures",
    jurisdiction
  )

  useEffect(() => {
    // clear the utilities values if the new jurisdiction doesn't have utilities included functionality
    if (!enableAccessibilityFeatures) {
      setValue("accessibilityFeatures", undefined)
    }
  }, [enableAccessibilityFeatures, setValue])

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={t("listings.sections.buildingFeaturesTitle")}
        subheading={t("listings.sections.buildingFeaturesSubtitle")}
      >
        <Grid.Row>
          <Grid.Cell>
            <Textarea
              label={t("t.propertyAmenities")}
              name={"amenities"}
              id={"amenities"}
              fullWidth={true}
              register={register}
              maxLength={600}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Textarea
              label={t("t.additionalAccessibility")}
              name={"accessibility"}
              id={"accessibility"}
              fullWidth={true}
              register={register}
              maxLength={600}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row>
          <Grid.Cell>
            <Textarea
              label={t("t.unitAmenities")}
              name={"unitAmenities"}
              id={"unitAmenities"}
              fullWidth={true}
              register={register}
              maxLength={600}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Textarea
              label={t("t.smokingPolicy")}
              name={"smokingPolicy"}
              id={"smokingPolicy"}
              fullWidth={true}
              register={register}
              maxLength={600}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row>
          <Grid.Cell>
            <Textarea
              label={t("t.petsPolicy")}
              name={"petPolicy"}
              id={"petPolicy"}
              fullWidth={true}
              register={register}
              maxLength={600}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Textarea
              label={t("t.servicesOffered")}
              name={"servicesOffered"}
              id={"servicesOffered"}
              fullWidth={true}
              register={register}
              maxLength={600}
            />
          </Grid.Cell>
        </Grid.Row>
        {!enableAccessibilityFeatures ? null : (
          <Grid.Row>
            <FieldValue label={t("listings.sections.accessibilityFeatures")}>
              <FieldGroup
                type="checkbox"
                name="accessibilityFeatures"
                fields={featureOptions}
                register={register}
                fieldGroupClassName="grid grid-cols-3 mt-4"
              />
            </FieldValue>
          </Grid.Row>
        )}
      </SectionWithGrid>
    </>
  )
}

export default BuildingFeatures
