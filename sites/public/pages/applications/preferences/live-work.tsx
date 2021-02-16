/*
4.1 Preferences Introduction
Instructions on how preferences work and their value
*/
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import {
  AppearanceStyleType,
  AlertBox,
  Button,
  ErrorMessage,
  Form,
  FormCard,
  ProgressNav,
  t,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import FormBackLink from "../../../src/forms/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"

export default () => {
  const { conductor, application, listing } = useFormConductor("preferencesLiveWork")
  const [showMore, setShowMore] = useState({})
  const currentPageSection = 4

  const preferenceOptions = ["live", "work"]
  const pluckPreference = (key: string) =>
    application.preferences.find((metadata) => metadata.key == key)
  const liveWorkPreference = pluckPreference("liveWork")

  const toggleShowMoreForOption = (option) =>
    setShowMore({ ...showMore, [option]: !showMore[option] })

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getValues, register, handleSubmit, errors, setValue, trigger } = useForm<
    Record<string, any>
  >({
    defaultValues: {
      live: liveWorkPreference?.options?.find((options) => options.key == "live").checked === true,
      work: liveWorkPreference?.options?.find((options) => options.key == "work").checked === true,
      none: liveWorkPreference?.claimed === false,
    },
    shouldFocusError: false,
  })
  const onSubmit = (data) => {
    /* if (!data.none) {
      conductor.completeSection(4)
    } */

    conductor.currentStep.save({ ...data })
    conductor.routeToNextOrReturnUrl()
  }

  return (
    <FormsLayout>
      <FormCard header={listing?.name}>
        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
        />
      </FormCard>

      <FormCard>
        <FormBackLink url={conductor.determinePreviousUrl()} />

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">{t("application.preferences.title")}</h2>

          <p className="field-note mt-5">{t("application.preferences.preamble")}</p>

          <p className="field-note mt-5 text-center">
            {t("t.pageXofY", { num: 1, total: conductor.preferenceStepsTotal })}
          </p>
        </div>

        {Object.entries(errors).length > 0 && (
          <AlertBox type="alert" inverted closeable>
            {t("errors.errorsToResolve")}
          </AlertBox>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group px-0 pb-3">
            <p className="field-note">{t("application.preferences.selectBelow")}</p>
          </div>

          {preferenceOptions.map((option) => (
            <div key={option} className="form-card__group px-0 border-b">
              <div className={"field " + (errors.none ? "error" : "")}>
                <input
                  type="checkbox"
                  id={option}
                  name={option}
                  ref={register}
                  onChange={() => {
                    setTimeout(() => {
                      setValue("none", false)
                      void trigger("none")
                    }, 1)
                  }}
                />
                <label htmlFor={option} className="font-semibold uppercase tracking-wider">
                  {t(`application.preferences.liveWork.${option}.label`)}
                </label>
              </div>

              <p className="ml-8 -mt-3">
                <button
                  type="button"
                  className="button is-unstyled m-0 no-underline has-toggle"
                  aria-expanded={showMore[option] ? "true" : "false"}
                  onClick={() => {
                    toggleShowMoreForOption(option)
                  }}
                >
                  {t(showMore[option] ? "t.readLess" : "t.readMore")}
                </button>
              </p>

              {showMore[option] && (
                <p className="field-note mt-6 ml-8">
                  {t(`application.preferences.liveWork.${option}.description`)}
                  {!t(`application.preferences.liveWork.${option}.link`).includes(
                    "application.preferences"
                  ) && (
                    <>
                      <br />
                      <a
                        className="block pt-2"
                        href={t(`application.preferences.liveWork.${option}.link`)}
                        target="_blank"
                      >
                        {t(`application.preferences.liveWork.${option}.link`).replace(
                          /https?:\/\//,
                          ""
                        )}
                      </a>
                    </>
                  )}
                </p>
              )}
            </div>
          ))}

          <div className="form-card__group px-0">
            <div className={"field " + (errors.none ? "error" : "")}>
              <input
                type="checkbox"
                id="none"
                name="none"
                ref={register({
                  validate: {
                    somethingIsChecked: (value) => {
                      return value || preferenceOptions.some((option) => getValues(option))
                    },
                  },
                })}
                onChange={(e) => {
                  if (e.target.checked) {
                    setValue("none", true)
                    preferenceOptions.forEach((option) => {
                      setValue(option, false)
                    })
                    void trigger("none")
                  }
                }}
              />
              <label htmlFor="none" className="font-semibold">
                {t("application.preferences.dontWant")}
              </label>

              <p className={"ml-8 field-note " + (errors.none ? "mb-5" : "")}>
                {t("application.preferences.stillHaveOpportunity")}
              </p>

              <ErrorMessage id="preferences-error" error={errors.none}>
                {t("errors.selectOption")}
              </ErrorMessage>
            </div>
          </div>

          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => {
                  conductor.returnToReview = false
                }}
              >
                {t("t.next")}
              </Button>
            </div>

            {conductor.canJumpForwardToReview() && (
              <div className="form-card__pager-row">
                <Button
                  unstyled={true}
                  className="mb-4"
                  onClick={() => {
                    conductor.returnToReview = true
                  }}
                >
                  {t("application.form.general.saveAndReturn")}
                </Button>
              </div>
            )}
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}
