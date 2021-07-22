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
import React from "react"
import { useRouter } from "next/router"
import { ELIGIBILITY_ROUTE, ELIGIBILITY_SECTIONS } from "../../lib/constants"

const EligibilityAge = () => {
  const router = useRouter()

  /* Form Handler */
  const { handleSubmit, register } = useForm()
  const onSubmit = () => {
    // Not yet implemented.
  }

  return (
    <FormsLayout>
      <FormCard header={t("eligibility.progress.header")}>
        <ProgressNav
          currentPageSection={3}
          completedSections={2}
          labels={ELIGIBILITY_SECTIONS.map((label) => t(`eligibility.progress.sections.${label}`))}
        />
      </FormCard>
      <FormCard>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__lead pb-0">
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
              inputProps={{ maxLength: 3 }}
              validation={{ required: true }}
              register={register}
            />
          </div>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => router.push(`/${ELIGIBILITY_ROUTE}/${ELIGIBILITY_SECTIONS[3]}`)}
              >
                {t("t.next")}
              </Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default EligibilityAge
