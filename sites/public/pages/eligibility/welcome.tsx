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
import { useForm } from "react-hook-form"
import React, { useContext } from "react"
import { useRouter } from "next/router"
import { ELIGIBILITY_SECTIONS } from "../../lib/constants"
import { eligibilityRoute } from "../../lib/helpers"
import { EligibilityContext } from "../../lib/EligibilityContext"
import EligibilityLayout from "../../layouts/eligibility"

const EligibilityWelcome = () => {
  const router = useRouter()
  const { eligibilityRequirements } = useContext(EligibilityContext)
  const CURRENT_PAGE = 0

  /* Form Handler */
  const { handleSubmit } = useForm()
  const onSubmit = async () => {
    await router.push(eligibilityRoute(CURRENT_PAGE + 1))
  }

  if (eligibilityRequirements.completedSections <= CURRENT_PAGE) {
    eligibilityRequirements.setCompletedSections(CURRENT_PAGE + 1)
  }

  return (
    <EligibilityLayout currentPageSection={1}>
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
              <Button styleType={AppearanceStyleType.primary}>{t("t.next")}</Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </EligibilityLayout>
  )
}

export default EligibilityWelcome
