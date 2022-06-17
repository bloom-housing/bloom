/*
5.1 Demographics
Optional demographic questions
*/
import React, { useContext, useEffect } from "react"
import {
  AppearanceStyleType,
  Button,
  FieldGroup,
  Form,
  FormCard,
  Select,
  ProgressNav,
  t,
  AuthContext,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import {
  ethnicityKeys,
  raceKeys,
  howDidYouHear,
  fieldGroupObjectToArray,
  OnClientSide,
  PageView,
  pushGtmEvent,
} from "@bloom-housing/shared-helpers"
import FormBackLink from "../../../src/forms/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"

const ApplicationDemographics = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("demographics")
  const currentPageSection = 5

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit } = useForm({
    defaultValues: {
      ethnicity: application.demographics.ethnicity,
      race: application.demographics.race,
    },
  })

  const onSubmit = (data) => {
    conductor.currentStep.save({
      demographics: {
        ethnicity: data.ethnicity,
        gender: "",
        sexualOrientation: "",
        howDidYouHear: data.howDidYouHear,
        race: fieldGroupObjectToArray(data, "race"),
      },
    })
    conductor.routeToNextOrReturnUrl()
  }

  const howDidYouHearOptions = () => {
    return howDidYouHear?.map((item) => ({
      id: item.id,
      label: t(`application.review.demographics.howDidYouHearOptions.${item.id}`),
      defaultChecked: application.demographics.howDidYouHear?.includes(item.id),
      register,
    }))
  }

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Demographics",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout>
      <FormCard header={listing?.name}>
        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
          mounted={OnClientSide()}
        />
      </FormCard>
      <FormCard>
        <FormBackLink
          url={conductor.determinePreviousUrl()}
          onClick={() => conductor.setNavigatedBack(true)}
        />

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">
            {t("application.review.demographics.title")}
          </h2>
          <p className="mt-4 field-note">{t("application.review.demographics.subTitle")}</p>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group border-b">
            <fieldset>
              <legend className="field-label--caps">
                {t("application.review.demographics.raceLabel")}
              </legend>
              <FieldGroup
                name="race"
                fields={Object.keys(raceKeys).map((rootKey) => ({
                  id: rootKey,
                  label: t(`application.review.demographics.raceOptions.${rootKey}`),
                  value: rootKey,
                  additionalText: rootKey.indexOf("other") >= 0,
                  defaultChecked: application[`race-${rootKey}`],
                  subFields: raceKeys[rootKey].map((subKey) => ({
                    id: subKey,
                    label: t(`application.review.demographics.raceOptions.${subKey}`),
                    value: subKey,
                    defaultChecked: application[`race-${subKey}`],
                    additionalText: subKey.indexOf("other") >= 0,
                  })),
                }))}
                type="checkbox"
                dataTestId={"app-demographics-race"}
                register={register}
              />
            </fieldset>
            <div className={"pt-4"}>
              <Select
                id="ethnicity"
                name="ethnicity"
                label={t("application.review.demographics.ethnicityLabel")}
                placeholder={t("t.selectOne")}
                register={register}
                labelClassName="field-label--caps mb-3"
                controlClassName="control"
                options={ethnicityKeys}
                keyPrefix="application.review.demographics.ethnicityOptions"
                dataTestId={"app-demographics-ethnicity"}
              />
            </div>
          </div>

          <div className="form-card__group is-borderless">
            <fieldset>
              <legend className="field-label--caps">
                {t("application.review.demographics.howDidYouHearLabel")}
              </legend>
              <FieldGroup
                type="checkbox"
                name="howDidYouHear"
                fields={howDidYouHearOptions()}
                register={register}
                dataTestId={"app-demographics-how-did-you-hear"}
              />
            </fieldset>
          </div>

          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button styleType={AppearanceStyleType.primary} data-test-id={"app-next-step-button"}>
                {t("t.next")}
              </Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default ApplicationDemographics
