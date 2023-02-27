/*
Eligibility Welcome
Explanation about the purpose of the questionnaire.
*/
import { t } from "@bloom-housing/ui-components"
import React from "react"
import { useForm } from "react-hook-form"
import EligibilityLayout from "../../layouts/eligibility"

const EligibilityWelcome = () => {
  return (
    <EligibilityLayout
      title={t("eligibility.welcome.header")}
      currentPage={0}
      formMethods={useForm()}
    >
      <div className="form-card__pager-row px-0">
        <img src="/images/detroit_spirit.png" alt="Spriti of the City of Detroit" />
        <p className="pt-4">{t("eligibility.welcome.description")}</p>
      </div>
    </EligibilityLayout>
  )
}

export default EligibilityWelcome
