/*
Accessibility
Prompts the user for their age to filter for properties that are age dependent.
*/
import {
    AppearanceStyleType,
    Button,
    FormCard,
    t,
    Form,
    ProgressNav,
    FieldGroup,
  } from "@bloom-housing/ui-components"
  import FormsLayout from "../../layouts/forms"
  import { useForm } from "react-hook-form"
  import React, { useContext } from "react"
  import { useRouter } from "next/router"
  import { ELIGIBILITY_DISCLAIMER_ROUTE, ELIGIBILITY_SECTIONS } from "../../lib/constants"
  import { AccessibilityFeatures, EligibilityContext } from "../../lib/EligibilityContext"
  import FormBackLink from "../../src/forms/applications/FormBackLink"
  import { eligibilityRoute } from "../../lib/helpers"
  
  const EligibilityAccessibility = () => {
    const router = useRouter()
    const CURRENT_PAGE = 4
    const { eligibilityRequirements } = useContext(EligibilityContext)
    /* Form Handler */
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { handleSubmit, register } = useForm()
  
    const onSubmit = async (data) => {
      eligibilityRequirements.setAccessibility()
      await router.push(eligibilityRoute(CURRENT_PAGE + 1))
    }
  
    const onClick = async (data) => {
      eligibilityRequirements.setAccessibility()
      await router.push(ELIGIBILITY_DISCLAIMER_ROUTE)
    }
  
    const accessibilityValues = [
        {
            id: "elevator",
            value: AccessibilityFeatures.elevator,
            label: t("eligibility.accessibility.elevator"),
            defaultChecked: false,
          },
          {
            id: "wheelchair_ramp",
            value: AccessibilityFeatures.wheelchair_ramp,
            label: t("eligibility.accessibility.wheelchair_ramp"),
            defaultChecked: false,
          },
          {
            id: "service_animals_allowed",
            value: AccessibilityFeatures.service_animals_allowed,
            label: t("eligibility.accessibility.service_animals_allowed"),
            defaultChecked: false,
          },
          {
            id: "accessible_parking",
            value: AccessibilityFeatures.accessible_parking,
            label: t("eligibility.accessibility.accessible_parking"),
            defaultChecked: false,
          },
    ]
  
    if (eligibilityRequirements.completedSections <= CURRENT_PAGE) {
      eligibilityRequirements.setCompletedSections(CURRENT_PAGE + 1)
    }
  
    return (
      <FormsLayout>
        <FormCard header={t("eligibility.progress.header")}>
          <ProgressNav
            currentPageSection={5}
            completedSections={eligibilityRequirements.completedSections}
            labels={ELIGIBILITY_SECTIONS.map((label) => t(`eligibility.progress.sections.${label}`))}
            routes={ELIGIBILITY_SECTIONS.map((_label, i) => eligibilityRoute(i))}
          />
        </FormCard>
        <FormCard>
          <FormBackLink
            url={eligibilityRoute(CURRENT_PAGE - 1)}
            onClick={() => {
              // Not extra actions needed.
            }}
          />
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-card__lead pb-0 pt-8">
              <h2 className="form-card__title is-borderless">{t("eligibility.accessibility.prompt")}</h2>
            </div>
            <div className="form-card__group is-borderless">
              <p className="field-note mb-4" id="accessibility-description">
                {t("eligibility.accessibility.description")}
              </p>
              <FieldGroup
                type="checkbox"
                name="accessibility"
                register={register}
                fields={accessibilityValues}
              />
            </div>
            <div className="form-card__pager">
              <div className="form-card__pager-row primary">
                <Button styleType={AppearanceStyleType.primary}>{t("t.next")}</Button>
                <Button
                  type="button"
                  onClick={handleSubmit(onClick)}
                  className="mx-2 mt-6"
                  styleType={AppearanceStyleType.primary}
                >
                  {t("t.finish")}
                </Button>
              </div>
            </div>
          </Form>
        </FormCard>
      </FormsLayout>
    )
  }
  
  export default EligibilityAccessibility
  