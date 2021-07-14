/*
Eligibility Welcome
Explanation about the purpose of the questionnaire.
*/
import { AppearanceStyleType, Button, FormCard, t, Form } from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { useForm } from "react-hook-form"
import { useFormConductor } from "../../lib/hooks"
import React from "react"

const EligibilityWelcome = () => {
  // The conductor is not yet implemented.
  const { conductor } = useFormConductor("welcome")

  /* Form Handler */
  const { handleSubmit } = useForm()
  const onSubmit = () => {
    conductor.routeToNextOrReturnUrl()
  }

  return (
    <FormsLayout>
      <FormCard>
        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless mt-4">
            {t("eligibility.welcome.header")}
          </h2>
        </div>
        <div className="form-card__pager-row px-16">
          <p className="field-note py-2">
            {t("eligibility.welcome.description")}
          </p>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => conductor.setNavigatedBack(false)}
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
