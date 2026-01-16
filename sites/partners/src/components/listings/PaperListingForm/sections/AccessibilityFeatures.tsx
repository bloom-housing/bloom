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
      name: item,
      label: t(`eligibility.accessibility.${item}`),
      defaultChecked: props.existingFeatures ? props.existingFeatures.includes(item) : false,
      register,
    }))
  }, [register, props.existingFeatures])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDrawerSubmit = (formData: Record<string, any>) => {
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

    props.setAccessibilityFeatures(
      Object.values(formData.configurableAccessibilityFeatures).flat() as string[]
    )
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
          <Grid spacing="lg" className="grid-inset-section">
            <Grid.Row>
              <Grid.Cell>
                {hasFeaturesSelected ? (
                  <>
                    <Heading priority={3} size={"lg"}>
                      {t("accessibility.summaryTitle")}
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
                    {hasFeaturesSelected
                      ? t("accessibility.drawerTitleEdit")
                      : t("accessibility.drawerTitleAdd")}
                  </Button>
                </div>
              </Grid.Cell>
            </Grid.Row>
          </Grid>
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
          {hasFeaturesSelected
            ? t("accessibility.drawerTitleEdit")
            : t("accessibility.drawerTitleAdd")}
        </Drawer.Header>
        <Drawer.Content>
          <Form id="a11y-features-drawer-form" onSubmit={handleSubmit(onDrawerSubmit)}>
            <Card>
              <Card.Section>
                <SectionWithGrid
                  heading={t("listings.sections.accessibilityFeatures")}
                  headingClassName={styles["heading-group-in-section"]}
                >
                  <div className={"field-label seeds-m-be-6"}>{t("accessibility.drawerInfo")}</div>
                  {Object.entries(expandedAccessibilityFeatures).map(([category]) => {
                    const label = t(`accessibility.categoryTitle.${category}Features`)
                    return (
                      <Grid.Row columns={1}>
                        <Grid.Cell>
                          <FieldGroup
                            type="checkbox"
                            name={`configurableAccessibilityFeatures.${category}`}
                            groupLabel={
                              requiredSections.includes(category as AccessibilitySubcategoriesEnum)
                                ? addAsterisk(label)
                                : label
                            }
                            fields={getFeatureGroupValues(
                              category as AccessibilitySubcategoriesEnum
                            )}
                            register={register}
                            fieldGroupClassName={styles["two-columns"]}
                            fieldLabelClassName={styles["label-option"]}
                            error={errors.configurableAccessibilityFeatures?.[category]}
                            errorMessage={
                              errors.configurableAccessibilityFeatures?.[category]?.message
                            }
                          />
                        </Grid.Cell>
                      </Grid.Row>
                    )
                  })}
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
            id="cancelFeaturesButton"
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            size="sm"
            variant="primary-outlined"
          >
            {t("t.cancel")}
          </Button>
        </Drawer.Footer>
      </Drawer>
    </>
  )
}

export default AccessibilityFeatures
