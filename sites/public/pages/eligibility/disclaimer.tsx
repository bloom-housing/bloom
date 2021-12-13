/*
Eligibility Disclaimer
Disclaimer about filtering and waitlists.
*/
import { AppearanceStyleType, Button, FormCard, t, Form } from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { useForm } from "react-hook-form"
import React, { useContext } from "react"
import { useRouter } from "next/router"
import { EligibilityContext } from "../../lib/EligibilityContext"
import { getFilterUrlLink } from "../../lib/filterUrlLink"
import EligibilityLayout from "../../layouts/eligibility"

const EligibilityDisclaimer = () => {
  const router = useRouter()
  const { eligibilityRequirements } = useContext(EligibilityContext)

  /* Form Handler */
  const { handleSubmit } = useForm()
  const onSubmit = async (data) => {
    await router.push(getFilterUrlLink(eligibilityRequirements))
  }

  return (
    <EligibilityLayout>
      <header className="eligibility-disclaimer-header">
        <h1 className="form-card__header_title">{t("eligibility.progress.sections.disclaimer")}</h1>
      </header>
      <div className="form-card__pager-row px-16">
        <p className="field-note py-2">{t("eligibility.disclaimer.description")}</p>
      </div>
      <Form className="eligibility-disclaimer-submit-container" onSubmit={handleSubmit(onSubmit)}>
        <Button styleType={AppearanceStyleType.primary}>{t("t.viewListings")}</Button>
      </Form>
    </EligibilityLayout>
  )
}

export default EligibilityDisclaimer
