/*
Bedroom Count
Prompts the user for the number of bedrooms they need.
*/
import {
  AppearanceStyleType,
  Button,
  FormCard,
  t,
  Form,
  FieldGroup,
  ProgressNav,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { useForm } from "react-hook-form"
import React from "react"
import { useRouter } from "next/router"
import { ELIGIBILITY_ROUTE, ELIGIBILITY_SECTIONS } from "../../lib/constants"

const EligibilityBedrooms = () => {
  const router = useRouter()

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, errors } = useForm()
  const onSubmit = () => {
    void router.push(`/${ELIGIBILITY_ROUTE}/${ELIGIBILITY_SECTIONS[2]}`)
  }

  const preferredUnitOptions = [
    { id: "studio", label: t("eligibility.bedrooms.studio") },
    { id: "1", label: "1" },
    { id: "2", label: "2" },
    { id: "3", label: "3" },
    { id: "4+", label: "4+" },
  ]

  return (
    <FormsLayout>
      <FormCard header={t("eligibility.progress.header")}>
        <ProgressNav
          currentPageSection={2}
          completedSections={1}
          labels={ELIGIBILITY_SECTIONS.map((label) => t(`eligibility.progress.sections.${label}`))}
        />
      </FormCard>
      <FormCard>
        <div className="form-card__lead pb-0 pt-8">
          <h2 className="form-card__title is-borderless">{t("eligibility.bedrooms.prompt")}</h2>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group">
            <fieldset>
              <legend className="sr-only">{t("eligibility.bedrooms.prompt")}</legend>
              <FieldGroup
                type="checkbox"
                name="preferredUnit"
                fields={preferredUnitOptions}
                error={errors.preferredUnit}
                errorMessage={t("errors.selectAtLeastOne")}
                validation={{ required: true }}
                register={register}
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

export default EligibilityBedrooms
