/*
Disability
Whether the applicant has accessibility needs.
*/
import { AppearanceStyleType, Button, FormCard, t, Form, Field } from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { useForm } from "react-hook-form"
import { useFormConductor } from "../../lib/hooks"
import React from "react"

const EligibilityDisability = () => {
  // The conductor is not yet implemented.
  const { conductor } = useFormConductor("whatToExpect")

  /* Form Handler */
  const { handleSubmit, register } = useForm()
  const onSubmit = () => {
    conductor.routeToNextOrReturnUrl()
  }

  return (
    <FormsLayout>
      <FormCard>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group">
            <fieldset>
              <legend className="field-label--caps">
                {t("eligibility.disability.prompt")}
              </legend>

              <p className="field-note mb-4">
                {t("eligibility.disability.description")}
              </p>

              <Field
                type="radio"
                id="disabilityNo"
                name="disabilityNo"
                label={t("t.no")}
                register={register}
                validation={{ required: true }}
                inputProps={{
                  value: "no",
                }}
              />

              <Field
                type="radio"
                id="disabilityYes"
                name="disabilityYes"
                label={t("t.yes")}
                register={register}
                validation={{ required: true }}
                inputProps={{
                  value: "yes",
                }}
              />

              <Field
                type="radio"
                id="disabilityPreferNotToSay"
                name="disabilityPreferNotToSay"
                label={t("eligibility.disability.preferNotToSay")}
                register={register}
                validation={{ required: true }}
                inputProps={{
                  value: "preferNotToSay",
                }}
              />
            </fieldset>
          </div>
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

export default EligibilityDisability
