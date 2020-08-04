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
import {
  ethnicityKeys,
  raceKeys,
  genderKeys,
  sexualOrientation,
  howDidYouHear,
} from "@bloom-housing/ui-components/src/helpers/formOptions"

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
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data) => {
    console.log(data)

    Router.push("/applications/review/summary").then(() => window.scrollTo(0, 0))
  }

  return (
    <FormsLayout>
      <FormCard>
        <h5 className="font-alt-sans text-center mb-5">LISTING</h5>

        <ProgressNav
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          labels={["You", "Household", "Income", "Preferences", "Review"]}
        />
      </FormCard>

      <FormCard>
        <p className="form-card__back">
          <strong>
            <Link href="/applications/contact/name">
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
              controlClassName="control"
              options={ethnicityKeys}
              keyPrefix="application.form.options.ethnicity"
            />

            <Select
              id="demographicsRace"
              name="demographicsRace"
              label={t("application.review.demographics.raceLabel")}
              placeholder={t("application.form.general.defaultSelectPlaceholder")}
              register={register}
              controlClassName="control"
              options={raceKeys}
              keyPrefix="application.form.options.race"
            />
          </div>

          <div className="form-card__group border-b">
            <Select
              id="demographicsGender"
              name="demographicsGender"
              label={t("application.review.demographics.genderLabel")}
              placeholder={t("application.form.general.defaultSelectPlaceholder")}
              register={register}
              controlClassName="control"
              options={genderKeys}
              keyPrefix="application.form.options.gender"
            />
          </div>

          <div className="form-card__group border-b">
            <Select
              id="demographicsSexualOrientation"
              name="demographicsSexualOrientation"
              label={t("application.review.demographics.sexualOrientationLabel")}
              placeholder={t("application.form.general.defaultSelectPlaceholder")}
              register={register}
              controlClassName="control"
              options={sexualOrientation}
              keyPrefix="application.form.options.sexualOrientation"
            />
          </div>

          <div className="text-center mt-6">
            <Button
              filled={true}
              onClick={() => {
                //
              }}
            >
              Next
            </Button>
          </div>
        </form>
      </FormCard>
    </FormsLayout>
  )
}
