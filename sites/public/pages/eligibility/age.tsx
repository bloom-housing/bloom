/*
Age
Prompts the user for their age to filter for properties that are age dependent.
*/
import {
  AppearanceStyleType,
  Button,
  FormCard,
  t,
  Form,
  Field,
  ProgressNav,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { useForm } from "react-hook-form"
import "./age.scss"
import React, { useContext } from "react"
import { useRouter } from "next/router"
import { ELIGIBILITY_ROUTE, ELIGIBILITY_SECTIONS } from "../../lib/constants"
import { EligibilityContext } from "../../lib/EligibilityContext"
import FormBackLink from "../../src/forms/applications/FormBackLink"
import { eligibilityRoute } from "../../lib/helpers"

const EligibilityAge = () => {
  const router = useRouter()
  // Check if they need to be 18 or older to apply?
  const MIN_AGE = 0
  const MAX_AGE = 120
  const CURRENT_PAGE = 2

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, errors, setError } = useForm()
  const { eligibilityRequirements } = useContext(EligibilityContext)

  const onSubmit = (data) => {
    if (isAgeValid(data.age)) {
      eligibilityRequirements.setAge(data.age)
      void router.push(eligibilityRoute(CURRENT_PAGE + 1))
    } else {
      setError("age", { type: "manual", message: "" })
    }
  }

  function isAgeValid(age: number) {
    return age >= MIN_AGE && age <= MAX_AGE
  }

  if (eligibilityRequirements.completedSections <= CURRENT_PAGE) {
    eligibilityRequirements.setCompletedSections(CURRENT_PAGE + 1)
  }

  return (
    <FormsLayout>
      <FormCard header={t("eligibility.progress.header")}>
        <ProgressNav
          currentPageSection={3}
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
            <h2 className="form-card__title is-borderless">{t("eligibility.age.prompt")}</h2>
          </div>
          <div className="form-card__group is-borderless">
            <p className="field-note mb-4" id="age-description">
              {t("eligibility.age.description")}
            </p>
            <Field
              className="age-field"
              id="age"
              name="age"
              label={t("eligibility.age.label")}
              describedBy="age-description"
              isLabelAfterField={true}
              defaultValue={eligibilityRequirements.age}
              inputProps={{ maxLength: 3 }}
              type={"number"}
              validation={{ required: true }}
              error={errors.age}
              errorMessage={t("eligibility.age.error")}
              register={register}
            />
          </div>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button styleType={AppearanceStyleType.primary}>{t("t.next")}</Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default EligibilityAge
