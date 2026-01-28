import React, { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { t, FieldGroup, Form } from "@bloom-housing/ui-components"
import { Button, Card, Drawer, Grid, Heading } from "@bloom-housing/ui-seeds"
import { ListingFeaturesConfiguration } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { addAsterisk, fieldHasError, getLabel } from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { getExpandedAccessibilityFeatures } from "../../PaperListingDetails/sections/DetailAccessibilityFeatures"
import styles from "../ListingForm.module.scss"

type AccessibilityFeaturesProps = {
  enableAccessibilityFeatures: boolean
  existingFeatures: string[]
  listingFeaturesConfiguration: ListingFeaturesConfiguration
  setAccessibilityFeatures: React.Dispatch<React.SetStateAction<string[]>>
}

const AccessibilityFeatures = (props: AccessibilityFeaturesProps) => {
  const formMethods = useFormContext()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, clearErrors, setError, setValue, getValues } = formMethods

  const hasFeaturesSelected = props.existingFeatures?.length > 0

  const hasCategories = props.listingFeaturesConfiguration?.categories?.length > 0

  const clearCategoryErrors = () => {
    props.listingFeaturesConfiguration?.categories?.forEach((category) => {
      clearErrors(`configurableAccessibilityFeatures.${category.id}`)
    })
  }

  useEffect(() => {
    if (!hasCategories && props.existingFeatures) {
      props.existingFeatures.forEach((feature) => {
        setValue(`configurableAccessibilityFeatures.${feature}`, true)
      })
    }
  }, [props.existingFeatures, hasCategories, setValue])

  useEffect(() => {
    if (isDrawerOpen) {
      props.listingFeaturesConfiguration?.categories?.forEach((category) => {
        const categoryFeatures = props.existingFeatures?.filter((feature) =>
          category.fields.some((field) => field.id === feature)
        )
        categoryFeatures?.forEach(() => {
          setValue(`configurableAccessibilityFeatures.${category.id}`, categoryFeatures || [])
        })
      })
    }
  }, [
    isDrawerOpen,
    props.existingFeatures,
    props.listingFeaturesConfiguration?.categories,
    setValue,
  ])

  const getFeatureSectionValues = (
    configuration: ListingFeaturesConfiguration,
    categoryId: string
  ) => {
    const features = configuration.categories.find((cat) => cat.id === categoryId)?.fields || []
    return features.map((item) => {
      return {
        id: item.id,
        label: t(`eligibility.accessibility.${item.id}`),
        defaultChecked: props.existingFeatures ? props.existingFeatures.includes(item.id) : false,
        register,
        inputProps: {
          onChange: () => {
            if (errors.configurableAccessibilityFeatures?.[categoryId])
              clearErrors(`configurableAccessibilityFeatures.${categoryId}`)
          },
        },
      }
    })
  }

  const featureOptions = props.listingFeaturesConfiguration?.fields
    ? props.listingFeaturesConfiguration.fields
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((item) => ({
          id: `configurableAccessibilityFeatures.${item.id}`,
          name: `configurableAccessibilityFeatures.${item.id}`,
          label: t(`eligibility.accessibility.${item.id}`),
          defaultChecked: props.existingFeatures ? props.existingFeatures.includes(item.id) : false,
          register,
        }))
    : null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDrawerSubmit = () => {
    const formData = getValues()
    let errors = false
    props.listingFeaturesConfiguration.categories?.forEach((category) => {
      if (category.required && !formData.configurableAccessibilityFeatures?.[category.id].length) {
        setError(`configurableAccessibilityFeatures.${category.id}`, {
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
    clearErrors("listingFeatures")
    clearCategoryErrors()
  }

  if (!props.enableAccessibilityFeatures || !props.listingFeaturesConfiguration) {
    return null
  }

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={t("listings.sections.accessibilityFeatures")}
        subheading={t("listings.sections.accessibilityFeaturesSubtitle")}
        className={styles["no-gap-grid"]}
      >
        {hasCategories ? (
          <>
            <div
              className={`field-label ${styles["custom-label"]} ${
                fieldHasError(errors?.listingFeatures) ? styles["label-error"] : ""
              }`}
            >
              {getLabel(
                "accessibilityFeatures",
                props.listingFeaturesConfiguration.categories?.some((category) => category.required)
                  ? ["accessibilityFeatures"]
                  : [],
                t("listings.sections.accessibilityFeatures")
              )}
            </div>
            <Grid className={`grid-inset-section`}>
              <Grid.Row>
                <Grid.Cell>
                  {hasFeaturesSelected ? (
                    <>
                      <Heading priority={3} size={"lg"}>
                        {t("accessibility.summaryTitle")}
                      </Heading>
                      {getExpandedAccessibilityFeatures(
                        props.existingFeatures,
                        props.listingFeaturesConfiguration
                      )}
                    </>
                  ) : null}
                  <div className={hasFeaturesSelected ? "seeds-m-bs-4" : ""}>
                    <Button
                      id="addFeaturesButton"
                      type="button"
                      variant={
                        fieldHasError(errors?.listingFeatures) ? "alert" : "primary-outlined"
                      }
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
            {errors.listingFeatures && (
              <div
                className={`field-label text-xs ${styles["custom-label"]} ${styles["label-error"]} seeds-m-bs-2`}
              >
                {t("errors.requiredFieldError")}
              </div>
            )}
          </>
        ) : (
          <Grid.Row>
            <FieldGroup
              type="checkbox"
              name="configurableAccessibilityFeatures"
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
                  className={styles["spacer-bottom-none"]}
                >
                  <div className={"field-label seeds-p-b-0_5"}>{t("accessibility.drawerInfo")}</div>
                  {props.listingFeaturesConfiguration.categories?.map((category, index) => {
                    const label = t(`accessibility.categoryTitle.${category.id}Features`)
                    return (
                      <Grid.Row columns={1} key={index}>
                        <Grid.Cell>
                          <div data-testid={`accessibility-features-section-${category.id}`}>
                            <FieldGroup
                              type="checkbox"
                              name={`configurableAccessibilityFeatures.${category.id}`}
                              groupLabel={category.required ? addAsterisk(label) : label}
                              fields={getFeatureSectionValues(
                                props.listingFeaturesConfiguration,
                                category.id
                              )}
                              register={register}
                              fieldGroupClassName={styles["two-columns"]}
                              fieldLabelClassName={styles["label-option"]}
                              error={errors.configurableAccessibilityFeatures?.[category.id]}
                              errorMessage={
                                errors.configurableAccessibilityFeatures?.[category.id]?.message
                              }
                            />
                          </div>
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
            onClick={() => {
              onDrawerSubmit()
            }}
          >
            {t("t.save")}
          </Button>
          <Button
            id="cancelFeaturesButton"
            type="button"
            onClick={() => {
              clearCategoryErrors()
              setIsDrawerOpen(false)
            }}
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
