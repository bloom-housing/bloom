import React, { useEffect, useMemo, useState } from "react"
import { useFormContext } from "react-hook-form"
import { t, FieldGroup, Form } from "@bloom-housing/ui-components"
import { Button, Card, Drawer, Grid, Heading } from "@bloom-housing/ui-seeds"
import {
  listingFeatures,
  expandedAccessibilityFeatures,
  AccessibilitySubcategoriesEnum,
} from "@bloom-housing/shared-helpers"
import { addAsterisk } from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { getDetailAccessibilityFeatures } from "../../PaperListingDetails/sections/DetailAccessibilityFeatures"
import styles from "../ListingForm.module.scss"

type AccessibilityFeaturesProps = {
  enableAccessibilityFeatures: boolean
  enableExpandedAccessibilityFeatures: boolean
  existingFeatures: string[]
  setAccessibilityFeatures: React.Dispatch<React.SetStateAction<string[]>>
}

const AccessibilityFeatures = (props: AccessibilityFeaturesProps) => {
  const formMethods = useFormContext()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, clearErrors, setError, setValue } = formMethods

  const hasFeaturesSelected = props.existingFeatures?.length > 0

  const requiredSections: AccessibilitySubcategoriesEnum[] = [
    AccessibilitySubcategoriesEnum.Flooring,
  ]

  useEffect(() => {
    if (!props.enableExpandedAccessibilityFeatures) {
      setValue("accessibilityFeatures", props.existingFeatures)
    }
  }, [props.existingFeatures, props.enableExpandedAccessibilityFeatures, setValue])

  const getFeatureGroupValues = (subcategory: AccessibilitySubcategoriesEnum) => {
    return expandedAccessibilityFeatures[subcategory].map((item) => ({
      id: item,
      label: t(`eligibility.accessibility.${item}`),
      defaultChecked: props.existingFeatures ? props.existingFeatures.includes(item) : false,
      register,
      inputProps: {
        onChange: () => {
          if (errors.accessibilityFeatures?.[subcategory])
            clearErrors(`accessibilityFeatures.${subcategory}`)
        },
      },
    }))
  }

  const featureOptions = useMemo(() => {
    return listingFeatures.map((item) => ({
      id: item,
      label: t(`eligibility.accessibility.${item}`),
      defaultChecked: props.existingFeatures ? props.existingFeatures.includes(item) : false,
      register,
    }))
  }, [register, props.existingFeatures])

  const expandedMobilityOptions = useMemo(() => {
    return getFeatureGroupValues(AccessibilitySubcategoriesEnum.Mobility)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, props.existingFeatures])

  const expandedBathroomOptions = useMemo(() => {
    return getFeatureGroupValues(AccessibilitySubcategoriesEnum.Bathroom)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, props.existingFeatures])

  const expandedFlooringOptions = useMemo(() => {
    return getFeatureGroupValues(AccessibilitySubcategoriesEnum.Flooring)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, props.existingFeatures])

  const expandedUtilityOptions = useMemo(() => {
    return getFeatureGroupValues(AccessibilitySubcategoriesEnum.Utility)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, props.existingFeatures])

  const expandedHearingVisionOptions = useMemo(() => {
    return getFeatureGroupValues(AccessibilitySubcategoriesEnum.HearingVision)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, props.existingFeatures])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDrawerSubmit = (formData: Record<string, any>) => {
    if (props.enableExpandedAccessibilityFeatures) {
      let errors = false
      Object.entries(expandedAccessibilityFeatures).forEach(([category, features]) => {
        if (
          requiredSections.includes(category as AccessibilitySubcategoriesEnum) &&
          !formData.configurableAccessibilityFeatures[category].some((feature) =>
            features.includes(feature)
          )
        ) {
          setError(`configurableAccessibilityFeatures.${category}`, {
            message: t("errors.requiredFieldError"),
          })
          errors = true
        }
      })
      if (errors) return
    }

    props.setAccessibilityFeatures(
      Object.values(formData.configurableAccessibilityFeatures).flat() as string[]
    )
    setIsDrawerOpen(false)
  }

  if (!props.enableAccessibilityFeatures && !props.enableExpandedAccessibilityFeatures) {
    return null
  }

  console.log(errors)

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={t("listings.sections.accessibilityFeatures")}
        subheading={t("listings.sections.accessibilityFeaturesSubtitle")}
      >
        {props.enableExpandedAccessibilityFeatures ? (
          <div>
            <Grid spacing="lg" className="grid-inset-section">
              <Grid.Row>
                <Grid.Cell>
                  {hasFeaturesSelected ? (
                    <>
                      <Heading priority={3} size={"lg"}>
                        Accessibility features summary
                      </Heading>
                      {getDetailAccessibilityFeatures(props.existingFeatures)}
                    </>
                  ) : null}
                  <div className={hasFeaturesSelected ? "seeds-m-bs-4" : ""}>
                    <Button
                      id="addFeaturesButton"
                      type="button"
                      variant="primary-outlined"
                      size="sm"
                      onClick={() => setIsDrawerOpen(true)}
                    >
                      {hasFeaturesSelected ? "Edit features" : "Add features"}
                    </Button>
                  </div>
                </Grid.Cell>
              </Grid.Row>
            </Grid>
          </div>
        ) : (
          <Grid.Row>
            <FieldGroup
              type="checkbox"
              name="accessibilityFeatures"
              groupLabel={t("listings.sections.accessibilityFeatures")}
              fields={featureOptions}
              register={register}
              fieldGroupClassName={styles["two-columns"]}
              fieldLabelClassName={styles["label-option"]}
            />
          </Grid.Row>
        )}
      </SectionWithGrid>
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        ariaLabelledBy="a11y-features-drawer-header"
      >
        <Drawer.Header id="a11y-features-drawer-header">
          {hasFeaturesSelected ? "Edit features" : "Add features"}
        </Drawer.Header>
        <Drawer.Content>
          <Form id="a11y-features-drawer-form" onSubmit={handleSubmit(onDrawerSubmit)}>
            <Card>
              <Card.Section>
                <SectionWithGrid
                  heading={"Accessibility features"}
                  headingClassName={styles["heading-group-in-section"]}
                >
                  <Grid.Row columns={1}>
                    <Grid.Cell>
                      <div className={"field-label seeds-m-be-6"}>
                        Select all accessibility features that apply to this listing. Fields marked
                        with an asterisk (*) are required.
                      </div>
                      <FieldGroup
                        type="checkbox"
                        name="configurableAccessibilityFeatures.mobility"
                        groupLabel={"Mobility features"}
                        fields={expandedMobilityOptions}
                        register={register}
                        fieldGroupClassName={styles["two-columns"]}
                        fieldLabelClassName={styles["label-option"]}
                        error={errors.configurableAccessibilityFeatures?.mobility}
                        errorMessage={errors.configurableAccessibilityFeatures?.mobility?.message}
                      />
                    </Grid.Cell>
                  </Grid.Row>
                  <Grid.Row columns={1}>
                    <Grid.Cell>
                      <FieldGroup
                        type="checkbox"
                        name="configurableAccessibilityFeatures.bathroom"
                        groupLabel={"Bathroom features"}
                        fields={expandedBathroomOptions}
                        register={register}
                        fieldGroupClassName={styles["two-columns"]}
                        fieldLabelClassName={styles["label-option"]}
                        error={errors.configurableAccessibilityFeatures?.bathroom}
                        errorMessage={errors.configurableAccessibilityFeatures?.bathroom?.message}
                      />
                    </Grid.Cell>
                  </Grid.Row>
                  <Grid.Row columns={1}>
                    <Grid.Cell>
                      <FieldGroup
                        type="checkbox"
                        name="configurableAccessibilityFeatures.flooring"
                        groupLabel={addAsterisk("Flooring")}
                        fields={expandedFlooringOptions}
                        register={register}
                        fieldGroupClassName={styles["two-columns"]}
                        fieldLabelClassName={styles["label-option"]}
                        error={errors.configurableAccessibilityFeatures?.flooring}
                        errorMessage={errors.configurableAccessibilityFeatures?.flooring?.message}
                      />
                    </Grid.Cell>
                  </Grid.Row>
                  <Grid.Row columns={1}>
                    <Grid.Cell>
                      <FieldGroup
                        type="checkbox"
                        name="configurableAccessibilityFeatures.utility"
                        groupLabel={"Utility features"}
                        fields={expandedUtilityOptions}
                        register={register}
                        fieldGroupClassName={styles["two-columns"]}
                        fieldLabelClassName={styles["label-option"]}
                        error={errors.configurableAccessibilityFeatures?.utility}
                        errorMessage={errors.configurableAccessibilityFeatures?.utility?.message}
                      />
                    </Grid.Cell>
                  </Grid.Row>
                  <Grid.Row columns={1}>
                    <Grid.Cell>
                      <FieldGroup
                        type="checkbox"
                        name="configurableAccessibilityFeatures.hearingVision"
                        groupLabel={"Hearing/Vision features"}
                        fields={expandedHearingVisionOptions}
                        register={register}
                        fieldGroupClassName={styles["two-columns"]}
                        fieldLabelClassName={styles["label-option"]}
                        error={errors.configurableAccessibilityFeatures?.hearingVision}
                        errorMessage={
                          errors.configurableAccessibilityFeatures?.hearingVision?.message
                        }
                      />
                    </Grid.Cell>
                  </Grid.Row>
                </SectionWithGrid>
              </Card.Section>
            </Card>
          </Form>
        </Drawer.Content>
        <Drawer.Footer>
          <Button
            id="saveFeaturesButton"
            key={0}
            variant="primary"
            size="sm"
            onClick={handleSubmit(onDrawerSubmit)}
          >
            {t("t.save")}
          </Button>
          <Button
            key={1}
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            size="sm"
            variant="primary-outlined"
          >
            {t("listingFilters.clear")}
          </Button>
        </Drawer.Footer>
      </Drawer>
    </>
  )
}

export default AccessibilityFeatures
