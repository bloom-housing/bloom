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
import React from "react"
import { useRouter } from "next/router"
import { ELIGIBILITY_ROUTE, ELIGIBILITY_SECTIONS } from "../../lib/constants"

const EligibilityDisability = () => {
  const router = useRouter()

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, errors } = useForm()
  const onSubmit = () => {
    void router.push(`/${ELIGIBILITY_ROUTE}/${ELIGIBILITY_SECTIONS[4]}`)
  }

  const disabilityValues = [
    {
      id: "disabilityNo",
      value: "no",
      label: t("t.no"),
    },
    {
      id: "disabilityYes",
      value: "yes",
      label: t("t.yes"),
    },
    {
      id: "disabilityPreferNotToSay",
      value: "preferNotToSay",
      label: t("eligibility.disability.preferNotToSay"),
    },
  ]

  return (
    <FormsLayout>
      <FormCard header={t("eligibility.progress.header")}>
        <ProgressNav
          currentPageSection={4}
          completedSections={3}
          labels={ELIGIBILITY_SECTIONS.map((label) => t(`eligibility.progress.sections.${label}`))}
        />
      </FormCard>
      <FormCard>
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
                error={errors.disability}
                errorMessage={t("errors.selectOption")}
                register={register}
                validation={{ required: true }}
                fields={disabilityValues}
              />
            </fieldset>
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

export default EligibilityDisability
