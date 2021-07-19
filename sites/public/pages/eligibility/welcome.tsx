/*
Eligibility Welcome
Explanation about the purpose of the questionnaire.
*/
import { AppearanceStyleType, Button, FormCard, t, Form } from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { useForm } from "react-hook-form"
import React from "react"
import { useRouter } from "next/router"

const EligibilityWelcome = () => {
  const router = useRouter()

  /* Form Handler */
  const { handleSubmit } = useForm()
  const onSubmit = () => {
    // Not implemented yet.
  }

  return (
    <FormsLayout>
      <FormCard>
        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless mt-4">{t("eligibility.welcome.header")}</h2>
        </div>
        <div className="form-card__pager-row px-16">
          <p className="field-note py-2">{t("eligibility.welcome.description")}</p>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => router.push("/eligibility/bedrooms")}
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
