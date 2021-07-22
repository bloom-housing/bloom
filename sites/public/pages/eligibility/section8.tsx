/*
Section 8
Asks whether the user has a section 8 voucher.
*/
import FormsLayout from "../../layouts/forms"
import React from "react"
import { FormCard } from "@bloom-housing/ui-components/src/blocks/FormCard"
import { t } from "@bloom-housing/ui-components/src/helpers/translator"
import { ProgressNav } from "@bloom-housing/ui-components/src/navigation/ProgressNav"
import { ELIGIBILITY_SECTIONS } from "../../lib/constants"
import { Form } from "@bloom-housing/ui-components/src/forms/Form"
import { Button } from "@bloom-housing/ui-components/src/actions/Button"
import { AppearanceStyleType, FieldGroup } from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"

const EligibilitySection8 = () => {
  /* Form Handler */
  const { handleSubmit, register, errors } = useForm()
  const onSubmit = () => {
    // Not yet implemented.
  }

  const section8Values = [
    {
      id: "section8No",
      value: "no",
      label: t("t.no"),
    },
    {
      id: "section8Yes",
      value: "yes",
      label: t("t.yes"),
    },
  ]

  return (
    <FormsLayout>
      <FormCard header={t("eligibility.progress.header")}>
        <ProgressNav
          currentPageSection={6}
          completedSections={5}
          labels={ELIGIBILITY_SECTIONS.map((label) => t(`eligibility.progress.sections.${label}`))}
        />
      </FormCard>
      <FormCard>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__lead pb-0">
            <h2 className="form-card__title is-borderless">{t("eligibility.section8.prompt")}</h2>
          </div>
          <div className="form-card__group">
            <fieldset>
              <legend className="sr-only">{t("eligibility.section8.prompt")}</legend>
              <FieldGroup
                type="radio"
                name="section8"
                error={errors.section8}
                errorMessage={t("errors.selectOption")}
                register={register}
                validation={{ required: true }}
                fields={section8Values}
              />
            </fieldset>
          </div>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              {/*TODO: Implement onClick method to display results.*/}
              <Button styleType={AppearanceStyleType.primary} onClick={() => {}}>
                {t("t.done")}
              </Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default EligibilitySection8
