/*
Disability
Whether the applicant has accessibility needs.
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
import { EligibilityContext } from "../../lib/EligibilityContext"
import { eligibilityRoute } from "../../lib/helpers"
import FormBackLink from "../../src/forms/applications/FormBackLink"
import { getFilterUrlLink } from "../../lib/filterUrlLink"

const EligibilityDisability = () => {
  const router = useRouter()
  const { eligibilityRequirements } = useContext(EligibilityContext)
  const CURRENT_PAGE = 3

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register } = useForm({
    defaultValues: {
      disability: eligibilityRequirements?.disability,
    },
  })

  const onSubmit = async (data) => {
    eligibilityRequirements.setDisability(data.disability)
    await router.push(eligibilityRoute(CURRENT_PAGE + 1))
  }

  const onClick = async (data) => {
    eligibilityRequirements.setDisability(data.disability)
    await router.push(ELIGIBILITY_DISCLAIMER_ROUTE)
  }

  const disabilityValues = [
    {
      id: "disabilityNo",
      value: "false",
      label: t("t.no"),
    },
    {
      id: "disabilityYes",
      value: "true",
      label: t("t.yes"),
    },
    {
      id: "disabilityPreferNotToSay",
      value: "preferNotToSay",
      label: t("eligibility.preferNotToSay"),
    },
  ]

  if (eligibilityRequirements.completedSections <= CURRENT_PAGE) {
    eligibilityRequirements.setCompletedSections(CURRENT_PAGE + 1)
  }

  return (
    <FormsLayout>
      <FormCard header={t("eligibility.progress.header")}>
        <ProgressNav
          currentPageSection={4}
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
            <h2 className="form-card__title is-borderless">{t("eligibility.disability.prompt")}</h2>
          </div>
          <div className="form-card__group">
            <p className="field-note mb-4">{t("eligibility.disability.description")}</p>
            <fieldset>
              <legend className="sr-only">{t("eligibility.disability.prompt")}</legend>
              <FieldGroup
                type="radio"
                name="disability"
                register={register}
                fields={disabilityValues}
              />
            </fieldset>
          </div>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button styleType={AppearanceStyleType.primary}>{t("t.next")}</Button>
              <Button
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

export default EligibilityDisability
