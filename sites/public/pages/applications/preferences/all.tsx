import React, { useMemo, useState, useEffect, useContext } from "react"
import { useForm } from "react-hook-form"
import {
  AlertBox,
  Form,
  FormCard,
  Field,
  t,
  ExpandableContent,
  Button,
  AppearanceStyleType,
  resolveObject,
  ProgressNav,
  FormAddress,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import FormBackLink from "../../../src/forms/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"
import {
  ApplicationSection,
  InputType,
  MultiselectOption,
  MultiselectQuestion,
} from "@bloom-housing/backend-core/types"
import {
  stateKeys,
  OnClientSide,
  PageView,
  pushGtmEvent,
  mapCheckboxesToApi,
  mapApiToMultiselectForm,
  setExclusive,
  AuthContext,
  getExclusiveKeys,
  fieldName,
  getCheckboxOption,
  getAllOptions,
  getPageQuestion,
  getInputType,
  getRadioFields,
  mapRadiosToApi,
} from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../../lib/constants"
import { check } from "prettier"

const ApplicationPreferencesAll = () => {
  const clientLoaded = OnClientSide()
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("preferencesAll")

  const preferences = listing?.listingMultiselectQuestions.filter(
    (question) => question.multiselectQuestion.applicationSection === ApplicationSection.preferences
  )
  const [page, setPage] = useState(conductor.navigatedThroughBack ? preferences.length : 1)
  const [applicationPreferences, setApplicationPreferences] = useState(application.preferences)
  const preference = getPageQuestion(preferences, page)

  const preferenceSetInputType = getInputType(preference?.options)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch, handleSubmit, errors, getValues, reset, trigger } = useForm({
    defaultValues: mapApiToMultiselectForm(
      applicationPreferences,
      preferences,
      ApplicationSection.preferences
    ),
  })

  const [exclusiveKeys, setExclusiveKeys] = useState(
    getExclusiveKeys(preference, ApplicationSection.preferences)
  )

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - All Preferences",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  // Required to keep the form up to date before submitting this section if you're moving between pages
  useEffect(() => {
    reset(
      mapApiToMultiselectForm(applicationPreferences, preferences, ApplicationSection.preferences)
    )
    setExclusiveKeys(getExclusiveKeys(preference, ApplicationSection.preferences))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, applicationPreferences, reset])

  const allOptionNames = useMemo(() => {
    return getAllOptions(preference, ApplicationSection.preferences)
  }, [preference])

  const onSubmit = (data) => {
    console.log({ data })
    const body =
      preferenceSetInputType === "checkbox"
        ? mapCheckboxesToApi(data, preference, ApplicationSection.preferences)
        : mapRadiosToApi(data, preference)
    console.log({ body })
    if (preferences.length > 1 && body) {
      // If there is more than one question, save the data in segments
      const currentPreferences = conductor.currentStep.application.preferences.filter(
        (preference) => {
          return preference.key !== body.key
        }
      )
      conductor.currentStep.save([...currentPreferences, body])
      setApplicationPreferences([...currentPreferences, body])
    } else {
      // Otherwise, submit all at once
      conductor.currentStep.save(body)
    }
    // Update to the next page if we have more pages
    if (page !== preferences.length) {
      setPage(page + 1)
      return
    }
    // Otherwise complete the section and move to the next URL
    conductor.completeSection(4)
    conductor.sync()
    conductor.routeToNextOrReturnUrl()
  }

  const watchPreferences = watch(allOptionNames)

  if (!clientLoaded || !allOptionNames) {
    return null
  }

  const checkboxOption = (option: MultiselectOption) => {
    return getCheckboxOption(
      option,
      preference,
      ApplicationSection.preferences,
      errors,
      register,
      trigger,
      setValue,
      getValues,
      exclusiveKeys,
      allOptionNames,
      watchPreferences
    )
  }

  return (
    <FormsLayout>
      <FormCard
        header={{
          isVisible: true,
          title: listing?.name,
        }}
      >
        <ProgressNav
          currentPageSection={4}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
          mounted={clientLoaded}
        />
      </FormCard>
      <FormCard>
        <FormBackLink
          url={conductor.determinePreviousUrl()}
          onClick={() => {
            conductor.setNavigatedBack(true)
            setPage(page - 1)
          }}
          custom={page !== 1}
        />

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">{t("application.preferences.title")}</h2>
          <p className="field-note mt-5">{t("application.preferences.preamble")}</p>
        </div>

        {!!Object.keys(errors).length && (
          <AlertBox type="alert" inverted closeable>
            {t("errors.errorsToResolve")}
          </AlertBox>
        )}

        <div className="form-card__group px-0 pb-0">
          <p className="field-note">{t("application.preferences.selectBelow")}</p>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div key={preference?.id}>
            <div className={`form-card__group px-0`}>
              {preferenceSetInputType === "checkbox" ? (
                <fieldset>
                  <legend className="field-label--caps mb-4">{preference?.text}</legend>
                  <p className="field-note mb-8">{preference?.description}</p>
                  {preference?.options
                    ?.sort((a, b) => (a.ordinal > b.ordinal ? 1 : -1))
                    .map((option) => {
                      return checkboxOption(option)
                    })}
                  {preference?.optOutText &&
                    checkboxOption({
                      text: preference.optOutText,
                      description: null,
                      links: [],
                      collectAddress: false,
                      exclusive: true,
                      ordinal: preference.options.length,
                    })}
                </fieldset>
              ) : (
                getRadioFields(
                  preference?.options,
                  errors,
                  register,
                  preference,
                  ApplicationSection.preferences
                )
              )}
            </div>
          </div>

          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => {
                  conductor.returnToReview = false
                  conductor.setNavigatedBack(false)
                }}
                data-test-id={"app-next-step-button"}
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

export default ApplicationPreferencesAll
