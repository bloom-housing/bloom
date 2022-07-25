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
  mapPreferencesToApi,
  mapApiToPreferencesForm,
  setExclusive,
  AuthContext,
  getExclusiveKeys,
} from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../../lib/constants"

const ApplicationPreferencesAll = () => {
  const clientLoaded = OnClientSide()
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("preferencesAll")
  const preferences = listing?.listingMultiselectQuestions.filter(
    (question) => question.multiselectQuestion.applicationSection === ApplicationSection.preference
  )
  const [page, setPage] = useState(conductor.navigatedThroughBack ? preferences.length : 1)
  const [applicationPreferences, setApplicationPreferences] = useState(application.preferences)
  const ordinalPreferences = preferences?.filter((item) => {
    return item.ordinal === page
  })

  const preference = ordinalPreferences?.length ? ordinalPreferences[0].multiselectQuestion : null

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch, handleSubmit, errors, getValues, reset, trigger } = useForm({
    // defaultValues: {
    //   application: { preferences: mapApiToPreferencesForm(applicationPreferences) },
    // },
  })

  const [exclusiveKeys, setExclusiveKeys] = useState(getExclusiveKeys(preference))

  let preferenceSetInputType = "checkbox"
  if (
    preference?.options?.filter((option) => option.exclusive).length === preference?.options?.length
  )
    preferenceSetInputType = "radio"

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - All Preferences",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  console.log({ preference })

  /*
    Required to keep the form up to date before submitting this section if you're moving between pages
  */
  useEffect(() => {
    // reset({
    //   application: { preferences: mapApiToPreferencesForm(applicationPreferences) },
    // })
    setExclusiveKeys(getExclusiveKeys(preference))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, applicationPreferences, reset])

  const preferenceCheckboxIds = useMemo(() => {
    const optionPaths = preference?.options?.map((option) => option.text) ?? []
    if (preference?.optOutText) {
      optionPaths.push(preference?.optOutText)
    }
    return optionPaths
  }, [preference])

  /*
    Submits the form
  */
  const onSubmit = (data) => {
    // const body = mapPreferencesToApi(data)
    // if (preferences.length > 1 && body) {
    //   // If we've got more than one preference, save the data in segments
    //   const currentPreferences = conductor.currentStep.application.preferences.filter(
    //     (preference) => {
    //       return preference.key !== body[0].key
    //     }
    //   )
    //   conductor.currentStep.save([...currentPreferences, body[0]])
    //   setApplicationPreferences([...currentPreferences, body[0]])
    // } else {
    //   // Otherwise, submit all at once
    //   conductor.currentStep.save(body)
    // }
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

  const allOptionFieldNames = useMemo(() => {
    return preference?.options?.map((option) => {
      return option.text
    })
  }, [preference])

  const watchPreferences = watch(allOptionFieldNames)

  if (!clientLoaded || !preferenceCheckboxIds) {
    return null
  }

  console.log({ preferenceCheckboxIds })

  const getOption = (option: MultiselectOption, preference: MultiselectQuestion) => {
    // const rootClassName = option.ordinal === preferences.length ? "mb-5" : "mb-5 border-b"
    return (
      <div className={"mb-5"} key={option.text}>
        <div className={`mb-5 field ${resolveObject(option.text, errors) ? "error" : ""}`}>
          <Field
            id={option.text}
            name={option.text}
            type={preferenceSetInputType}
            label={option.text}
            register={register}
            inputProps={{
              onChange: (e) => {
                if (e.target.checked) {
                  void trigger()
                }
                if (option.exclusive && e.target.checked)
                  setExclusive(true, setValue, exclusiveKeys, option.text, preference?.options)
                if (!option.exclusive)
                  setExclusive(false, setValue, exclusiveKeys, option.text, preference?.options)
              },
            }}
            validation={{
              validate: {
                somethingIsChecked: (value) =>
                  value || !!preferenceCheckboxIds.find((option) => getValues(option)),
              },
            }}
            dataTestId={"app-preference-option"}
          />
        </div>

        {option.description && (
          <div className="ml-8 -mt-5 mb-5">
            <ExpandableContent strings={{ readMore: t("t.readMore"), readLess: t("t.readLess") }}>
              <p className="field-note mb-2">
                {option.description}
                <br />
                {option?.links?.map((link) => (
                  <a key={link.url} className="block pt-2" href={link.url}>
                    {link.title}
                  </a>
                ))}
              </p>
            </ExpandableContent>
          </div>
        )}

        {watchPreferences[option.text] && option.collectAddress && (
          <div className="pb-4">
            <FormAddress
              subtitle={t("application.preferences.options.address")}
              dataKey={option.text}
              register={register}
              errors={errors}
              required={true}
              stateKeys={stateKeys}
              data-test-id={"app-preference-extra-field"}
            />
          </div>
        )}
      </div>
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
          custom={page === preferences?.length}
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
              <fieldset>
                <legend className="field-label--caps mb-4">{preference?.text}</legend>
                <p className="field-note mb-8">{preference?.description}</p>
                {preference?.options?.map((option) => {
                  return getOption(option, preference)
                })}
                {preference?.optOutText &&
                  getOption(
                    {
                      text: preference.optOutText,
                      description: null,
                      links: [],
                      collectAddress: false,
                      exclusive: true,
                    },
                    preference
                  )}
              </fieldset>
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
