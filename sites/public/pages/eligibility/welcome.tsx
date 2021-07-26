/*
Eligibility Welcome
Explanation about the purpose of the questionnaire.
*/
import {
  AppearanceStyleType,
  Button,
  FormCard,
  t,
  Form,
  ProgressNav,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { useForm } from "react-hook-form"
import React from "react"
import { useRouter } from "next/router"
import { ELIGIBILITY_ROUTE, ELIGIBILITY_SECTIONS } from "../../lib/constants"

const EligibilityWelcome = () => {
  const router = useRouter()

  /* Form Handler */
  const { handleSubmit } = useForm()
  const onSubmit = () => {
    // Not implemented yet.
  }

  return (
    <FormsLayout>
      <FormCard header={t("eligibility.progress.header")}>
        <ProgressNav
          currentPageSection={1}
          completedSections={0}
          labels={ELIGIBILITY_SECTIONS.map((label) => t(`eligibility.progress.sections.${label}`))}
        />
      </FormCard>
      <FormCard>
        <div className="form-card__lead pb-0 pt-8">
          <h2 className="form-card__title is-borderless">{t("eligibility.welcome.header")}</h2>
        </div>
        <div className="form-card__pager-row px-16">
          <p className="field-note py-2">{t("eligibility.welcome.description")}</p>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => router.push(`/${ELIGIBILITY_ROUTE}/${ELIGIBILITY_SECTIONS[1]}`)}
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

export default EligibilityWelcome
