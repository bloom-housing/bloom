import React, { useMemo, useState } from "react"
import { useFormContext } from "react-hook-form"
import { t, FieldGroup, Form } from "@bloom-housing/ui-components"
import { Button, Card, Drawer, Grid } from "@bloom-housing/ui-seeds"
import {
  expandedMobilityFeatures,
  listingFeatures,
  expandedBathroomFeatures,
  expandedFlooringFeatures,
  expandedUtilityFeatures,
  expandedHearingVisionFeatures,
} from "@bloom-housing/shared-helpers"
import { ListingFeaturesCreate } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import styles from "../ListingForm.module.scss"

type AccessibilityFeaturesProps = {
  enableAccessibilityFeatures: boolean
  enableExpandedAccessibilityFeatures: boolean
  existingFeatures: ListingFeaturesCreate
}

const AccessibilityFeatures = (props: AccessibilityFeaturesProps) => {
  const formMethods = useFormContext()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, errors, clearErrors, handleSubmit } = formMethods

  const featureOptions = useMemo(() => {
    return listingFeatures.map((item) => ({
      id: item,
      label: t(`eligibility.accessibility.${item}`),
      defaultChecked: props.existingFeatures ? props.existingFeatures[item] : false,
      register,
    }))
  }, [register, props.existingFeatures])

  const expandedMobilityOptions = useMemo(() => {
    return expandedMobilityFeatures.map((item) => ({
      id: item,
      label: t(`eligibility.accessibility.${item}`),
      defaultChecked: props.existingFeatures ? props.existingFeatures[item] : false,
      register,
    }))
  }, [register, props.existingFeatures])

  const expandedBathroomOptions = useMemo(() => {
    return expandedBathroomFeatures.map((item) => ({
      id: item,
      label: t(`eligibility.accessibility.${item}`),
      defaultChecked: props.existingFeatures ? props.existingFeatures[item] : false,
      register,
    }))
  }, [register, props.existingFeatures])

  const expandedFlooringOptions = useMemo(() => {
    return expandedFlooringFeatures.map((item) => ({
      id: item,
      label: t(`eligibility.accessibility.${item}`),
      defaultChecked: props.existingFeatures ? props.existingFeatures[item] : false,
      register,
    }))
  }, [register, props.existingFeatures])

  const expandedUtilityOptions = useMemo(() => {
    return expandedUtilityFeatures.map((item) => ({
      id: item,
      label: t(`eligibility.accessibility.${item}`),
      defaultChecked: props.existingFeatures ? props.existingFeatures[item] : false,
      register,
    }))
  }, [register, props.existingFeatures])

  const expandedHearingVisionOptions = useMemo(() => {
    return expandedHearingVisionFeatures.map((item) => ({
      id: item,
      label: t(`eligibility.accessibility.${item}`),
      defaultChecked: props.existingFeatures ? props.existingFeatures[item] : false,
      register,
    }))
  }, [register, props.existingFeatures])

  //   useEffect(() => {
  //     // clear the a11y features values if the new jurisdiction doesn't have utilities included functionality
  //     if (!props.enableAccessibilityFeatures) {
  //       setValue("accessibilityFeatures", undefined)
  //     }
  //   }, [props.enableAccessibilityFeatures, setValue])
  const onDrawerSubmit = () => {
    setIsDrawerOpen(false)
  }

  if (!props.enableAccessibilityFeatures && !props.enableExpandedAccessibilityFeatures) {
    return null
  }

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
                  <Button
                    id="addFeaturesButton"
                    type="button"
                    variant="primary-outlined"
                    size="sm"
                    onClick={() => setIsDrawerOpen(true)}
                  >
                    Add features
                  </Button>
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
              fieldGroupClassName="grid grid-cols-3 mt-2 gap-x-4"
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
        <Drawer.Header id="a11y-features-drawer-header">{"Add features"}</Drawer.Header>
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
                        name="accessibilityFeatures"
                        groupLabel={"Mobility features"}
                        fields={expandedMobilityOptions}
                        register={register}
                        fieldGroupClassName="grid grid-cols-2 mt-2 gap-x-4"
                        fieldLabelClassName={styles["label-option"]}
                      />
                    </Grid.Cell>
                  </Grid.Row>
                  <Grid.Row columns={1}>
                    <Grid.Cell>
                      <FieldGroup
                        type="checkbox"
                        name="accessibilityFeatures"
                        groupLabel={"Bathroom features"}
                        fields={expandedBathroomOptions}
                        register={register}
                        fieldGroupClassName="grid grid-cols-2 mt-2 gap-x-4"
                        fieldLabelClassName={styles["label-option"]}
                      />
                    </Grid.Cell>
                  </Grid.Row>
                  <Grid.Row columns={1}>
                    <Grid.Cell>
                      <FieldGroup
                        type="checkbox"
                        name="accessibilityFeatures"
                        groupLabel={"Flooring"}
                        fields={expandedFlooringOptions}
                        register={register}
                        fieldGroupClassName="grid grid-cols-2 mt-2 gap-x-4"
                        fieldLabelClassName={styles["label-option"]}
                      />
                    </Grid.Cell>
                  </Grid.Row>
                  <Grid.Row columns={1}>
                    <Grid.Cell>
                      <FieldGroup
                        type="checkbox"
                        name="accessibilityFeatures"
                        groupLabel={"Utility features"}
                        fields={expandedUtilityOptions}
                        register={register}
                        fieldGroupClassName="grid grid-cols-2 mt-2 gap-x-4"
                        fieldLabelClassName={styles["label-option"]}
                      />
                    </Grid.Cell>
                  </Grid.Row>
                  <Grid.Row columns={1}>
                    <Grid.Cell>
                      <FieldGroup
                        type="checkbox"
                        name="accessibilityFeatures"
                        groupLabel={"Hearing/Vision features"}
                        fields={expandedHearingVisionOptions}
                        register={register}
                        fieldGroupClassName="grid grid-cols-2 mt-2 gap-x-4"
                        fieldLabelClassName={styles["label-option"]}
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
