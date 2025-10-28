import React, { useMemo, useContext, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { t, Textarea, FieldGroup } from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import { listingFeatures, AuthContext } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  ListingFeatures,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { defaultFieldProps } from "../../../../lib/helpers"
import styles from "../ListingForm.module.scss"

type BuildingFeaturesProps = {
  existingFeatures: ListingFeatures
  requiredFields: string[]
}

const BuildingFeatures = (props: BuildingFeaturesProps) => {
  const formMethods = useFormContext()
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, setValue, errors, clearErrors } = formMethods
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
    FeatureFlagEnum.enableAccessibilityFeatures,
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
              fullWidth={true}
              placeholder={""}
              register={register}
              maxLength={600}
              {...defaultFieldProps(
                "amenities",
                t("t.propertyAmenities"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Textarea
              fullWidth={true}
              placeholder={""}
              register={register}
              maxLength={600}
              {...defaultFieldProps(
                "accessibility",
                t("t.additionalAccessibility"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row>
          <Grid.Cell>
            <Textarea
              fullWidth={true}
              placeholder={""}
              register={register}
              maxLength={600}
              {...defaultFieldProps(
                "unitAmenities",
                t("t.unitAmenities"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Textarea
              fullWidth={true}
              placeholder={""}
              register={register}
              maxLength={600}
              {...defaultFieldProps(
                "smokingPolicy",
                t("t.smokingPolicy"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row>
          <Grid.Cell>
            <Textarea
              fullWidth={true}
              placeholder={""}
              register={register}
              maxLength={600}
              {...defaultFieldProps(
                "petPolicy",
                t("t.petsPolicy"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Textarea
              fullWidth={true}
              placeholder={""}
              register={register}
              maxLength={600}
              {...defaultFieldProps(
                "servicesOffered",
                t("t.servicesOffered"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
        </Grid.Row>
        {!enableAccessibilityFeatures ? null : (
          <Grid.Row>
            <FieldGroup
              type="checkbox"
              name="accessibilityFeatures"
              groupLabel={t("listings.sections.accessibilityFeatures")}
              fields={featureOptions}
              register={register}
              fieldGroupClassName="grid grid-cols-3 mt-2 gap-x-4"
              fieldLabelClassName={styles["label-option"]}
            />
          </Grid.Row>
        )}
      </SectionWithGrid>
    </>
  )
}

export default BuildingFeatures
