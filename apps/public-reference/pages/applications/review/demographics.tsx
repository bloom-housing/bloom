/*
5.1 Demographics
Optional demographic questions
*/
import Link from "next/link"
import Router from "next/router"
import { Button, FormCard, ProgressNav, t } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import { useContext, useMemo } from "react"
import { Select } from "@bloom-housing/ui-components/src/forms/Select"
import { CheckboxGroup } from "@bloom-housing/ui-components/src/forms/CheckboxGroup"
import {
  ethnicityKeys,
  raceKeys,
  genderKeys,
  sexualOrientation,
  howDidYouHear,
} from "@bloom-housing/ui-components/src/helpers/formOptions"
import { getCheckboxValues } from "@bloom-housing/ui-components/src/helpers/checkboxValues"
import FormStep from "../../../src/forms/applications/FormStep"

export default () => {
  const context = useContext(AppSubmissionContext)
  const { application, listing } = context
  const conductor = useMemo(() => new ApplicationConductor(application, listing, context), [
    application,
    listing,
    context,
  ])
  const currentPageStep = 5

  /* Form Handler */
  const { register, handleSubmit } = useForm()
  const onSubmit = (data) => {
    const howDidYouHearKeys = howDidYouHear.map((item) => item.name)
    const howDidYouHearValue = getCheckboxValues({ keys: howDidYouHearKeys, data })

    const { demographicsEthnicity, demographicsGender, demographicsSexualOrientation } = data

    console.log("val: ", howDidYouHearValue)

    new FormStep(conductor).save({
      demographics: {
        ethnicity: demographicsEthnicity,
        gender: demographicsGender,
        sexualOrientation: demographicsSexualOrientation,
        howDidYouHear: howDidYouHearValue,
      },
    })

    Router.push("/applications/review/summary").then(() => window.scrollTo(0, 0))
  }

  const howDidYouHearOptions = useMemo(() => {
    return howDidYouHear?.map((item) => ({
      name: item.name,
      label: t(`application.review.demographics.howDidYouHearOptions.${item.name}`),
      defaultChecked: item.checked,
      register,
    }))
  }, [])

  return (
    <FormsLayout>
      <FormCard header="LISTING">
        <ProgressNav
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          labels={["You", "Household", "Income", "Preferences", "Review"]}
        />
      </FormCard>

      <FormCard>
        <p className="form-card__back">
          <strong>
            <Link href="/applications/preferences/general">
              <a>{t("t.back")}</a>
            </Link>
          </strong>
        </p>

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">
            {t("application.review.demographics.title")}
          </h2>
          <p className="mt-4 field-note">{t("application.review.demographics.subTitle")}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group border-b">
            <Select
              id="demographicsEthnicity"
              name="demographicsEthnicity"
              label={t("application.review.demographics.ethnicityLabel")}
              placeholder={t("application.form.general.defaultSelectPlaceholder")}
              register={register}
              labelClassName="field-label--caps"
              controlClassName="control"
              options={ethnicityKeys}
              keyPrefix="application.review.demographics.ethnicityOptions"
            />

            <Select
              id="demographicsRace"
              name="demographicsRace"
              label={t("application.review.demographics.raceLabel")}
              placeholder={t("application.form.general.defaultSelectPlaceholder")}
              register={register}
              labelClassName="field-label--caps"
              controlClassName="control"
              options={raceKeys}
              keyPrefix="application.review.demographics.raceOptions"
            />
          </div>

          <div className="form-card__group border-b">
            <Select
              id="demographicsGender"
              name="demographicsGender"
              label={t("application.review.demographics.genderLabel")}
              placeholder={t("application.form.general.defaultSelectPlaceholder")}
              register={register}
              labelClassName="field-label--caps"
              controlClassName="control"
              options={genderKeys}
              keyPrefix="application.review.demographics.genderOptions"
            />
          </div>

          <div className="form-card__group border-b">
            <Select
              id="demographicsSexualOrientation"
              name="demographicsSexualOrientation"
              label={t("application.review.demographics.sexualOrientationLabel")}
              placeholder={t("application.form.general.defaultSelectPlaceholder")}
              register={register}
              labelClassName="field-label--caps"
              controlClassName="control"
              options={sexualOrientation}
              keyPrefix="application.review.demographics.sexualOrientationOptions"
            />
          </div>

          <div className="form-card__group is-borderless">
            <CheckboxGroup
              name="howDidYouHear"
              groupLabel={t("application.review.demographics.howDidYouHearLabel")}
              fields={howDidYouHearOptions}
            />
          </div>

          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                filled={true}
                onClick={() => {
                  //
                }}
              >
                Next
              </Button>
            </div>
          </div>

          <div className="p-8 text-center">
            <Link href="/">
              <a className="lined">{t("application.form.general.saveAndFinishLater")}</a>
            </Link>
          </div>
        </form>
      </FormCard>
    </FormsLayout>
  )
}
