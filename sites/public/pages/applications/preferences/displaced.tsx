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
  Field,
  Form,
  FormCard,
  ProgressNav,
  Select,
  stateKeys,
  t,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import FormBackLink from "../../../src/forms/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"

export default () => {
  const { conductor, application, listing } = useFormConductor("preferencesDisplaced")
  const [hideReviewButton, setHideReviewButton] = useState(false)
  const [showMore, setShowMore] = useState({})
  const currentPageSection = 4

  const preferenceOptions = ["general", "missionCorridor"]
  const pluckPreference = (key: string) =>
    application.preferences.find((metadata) => metadata.key == key)
  const displacedPreference = pluckPreference("displacedTenant")

  const toggleShowMoreForOption = (option) =>
    setShowMore({ ...showMore, [option]: !showMore[option] })

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getValues, register, handleSubmit, errors, setValue, trigger, watch } = useForm<
    Record<string, any>
  >({
    defaultValues: {
      general:
        displacedPreference?.options?.find((options) => options.key == "general").checked === true,
      missionCorridor:
        displacedPreference?.options?.find((options) => options.key == "missionCorridor")
          .checked === true,
      none: displacedPreference?.claimed === false,
      generalName: displacedPreference?.options?.find((options) => options.key == "general")
        ?.extraData[0]?.value,
      generalAddress: displacedPreference?.options?.find((options) => options.key == "general")
        ?.extraData[1]?.value,
      missionCorridorName: displacedPreference?.options?.find(
        (options) => options.key == "missionCorridor"
      )?.extraData[0]?.value,
      missionCorridorAddress: displacedPreference?.options?.find(
        (options) => options.key == "missionCorridor"
      )?.extraData[1]?.value,
    },
    shouldFocusError: false,
  })
  const onSubmit = (data) => {
    if (!conductor.canJumpForwardToReview()) setHideReviewButton(true)

    conductor.currentStep.save({ ...data })
    if (application.preferences.some((item) => item.claimed)) {
      conductor.completeSection(4)
      conductor.sync()
    }
    conductor.routeToNextOrReturnUrl()
  }

  const generalOptionSelected = watch("general")
  const missionOptionSelected = watch("missionCorridor")

  const householdMemberOptions = [
    {
      label: `${application.applicant.firstName} ${application.applicant.lastName}`,
      value: `${application.applicant.firstName} ${application.applicant.lastName}`,
    },
  ].concat(
    application.householdMembers.map((member) => {
      return {
        label: `${member.firstName} ${member.lastName}`,
        value: `${member.firstName} ${member.lastName}`,
      }
    })
  )

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
            {t("t.pageXofY", { num: 2, total: conductor.preferenceStepsTotal })}
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
                  {t(`application.preferences.displacedTenant.${option}.label`)}
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
                  {t(`application.preferences.displacedTenant.${option}.description`)}
                  {!t(`application.preferences.displacedTenant.${option}.link`).includes(
                    "application.preferences"
                  ) && (
                    <>
                      <br />
                      <a
                        className="block pt-2"
                        href={t(`application.preferences.displacedTenant.${option}.link`)}
                        target="_blank"
                      >
                        {t(`application.preferences.displacedTenant.${option}.link`).replace(
                          /https?:\/\//,
                          ""
                        )}
                      </a>
                    </>
                  )}
                </p>
              )}

              {((option == "general" && generalOptionSelected) ||
                (option == "missionCorridor" && missionOptionSelected)) && (
                <div className="mt-6 ml-8">
                  <fieldset>
                    <legend className="field-label--caps">
                      {t("application.preferences.displacedTenant.whichHouseholdMember")}
                    </legend>

                    <Select
                      name={`${option}Name`}
                      label={t("t.name")}
                      labelClassName="sr-only"
                      controlClassName="control"
                      placeholder={t("t.selectOne")}
                      validation={{ required: true }}
                      error={errors[`${option}Name`]}
                      errorMessage={t("errors.selectOption")}
                      options={householdMemberOptions}
                      register={register}
                    />
                  </fieldset>
                  <fieldset className="mt-5">
                    <legend className="field-label--caps">
                      {t("application.preferences.displacedTenant.whatAddress")}
                    </legend>
                    <Field
                      id={`${option}Address.street`}
                      name={`${option}Address.street`}
                      label={t("application.contact.streetAddress")}
                      placeholder={t("application.contact.streetAddress")}
                      validation={{ required: true }}
                      error={errors[`${option}Address`]?.street}
                      errorMessage={t("errors.streetError")}
                      register={register}
                    />

                    <Field
                      id={`${option}Address.street2`}
                      name={`${option}Address.street2`}
                      label={t("application.contact.apt")}
                      placeholder={t("application.contact.apt")}
                      register={register}
                    />

                    <div className="flex max-w-2xl">
                      <Field
                        id={`${option}Address.city`}
                        name={`${option}Address.city`}
                        label={t("application.contact.cityName")}
                        placeholder={t("application.contact.cityName")}
                        validation={{ required: true }}
                        error={errors[`${option}Address`]?.city}
                        errorMessage={t("errors.cityError")}
                        register={register}
                      />

                      <Select
                        id={`${option}Address.state`}
                        name={`${option}Address.state`}
                        label={t("application.contact.state")}
                        validation={{ required: true }}
                        error={errors[`${option}Address`]?.state}
                        errorMessage={t("errors.stateError")}
                        register={register}
                        controlClassName="control"
                        options={stateKeys}
                        keyPrefix="states"
                      />
                    </div>
                    <Field
                      id={`${option}Address.zipCode`}
                      name={`${option}Address.zipCode`}
                      label={t("application.contact.zip")}
                      placeholder={t("application.contact.zipCode")}
                      validation={{ required: true }}
                      error={errors[`${option}Address`]?.zipCode}
                      errorMessage={t("errors.zipCodeError")}
                      register={register}
                    />
                  </fieldset>
                </div>
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

            {!hideReviewButton && conductor.canJumpForwardToReview() && (
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
