import React, { useMemo } from "react"
import { useForm } from "react-hook-form"
import {
  AlertBox,
  Form,
  FormCard,
  ProgressNav,
  Field,
  t,
  ExtraField,
  PREFERENCES_FORM_PATH,
  PREFERENCES_NONE_FORM_PATH,
  ExpandableContent,
  Button,
  AppearanceStyleType,
  resolveObject,
  mapPreferencesToApi,
  mapApiToPreferencesForm,
  getPreferenceOptionName,
  OnClientSide,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import FormBackLink from "../../../src/forms/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"
import { FormMetadataOptions } from "@bloom-housing/backend-core/types"

const PreferencesAll = () => {
  const clientLoaded = OnClientSide()

  const { conductor, application, listing } = useFormConductor("preferencesAll")
  const preferences = listing?.preferences

  const currentPageSection = 4

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch, handleSubmit, errors, getValues, trigger } = useForm({
    defaultValues: {
      application: { preferences: mapApiToPreferencesForm(application.preferences) },
    },
  })

  /*
    It collects all checkbox ids for each preference to check if at least one checkbox / preference is checked.
    Validation is used in 'somethingIsChecked' validator.
    E.g.

    liveWork:
      application.preferences.options.liveWork.live.claimed
      application.preferences.options.liveWork.work.claimed
  */
  const preferenceCheckboxIds = useMemo(() => {
    return preferences?.reduce((acc, item) => {
      const preferenceName = item.formMetadata?.key
      const optionPaths = item.formMetadata?.options?.map(
        (option) => `${PREFERENCES_FORM_PATH}.${preferenceName}.${option.key}.claimed`
      )

      Object.assign(acc, {
        [preferenceName]: optionPaths,
      })

      return acc
    }, {})
  }, [preferences])

  const onSubmit = (data) => {
    const body = mapPreferencesToApi(data)

    conductor.currentStep.save(body)
    conductor.routeToNextOrReturnUrl()
  }

  const allOptionFieldNames = useMemo(() => {
    const keys = []
    preferences?.forEach((preference) =>
      preference?.formMetadata?.options.forEach((option) =>
        keys.push(getPreferenceOptionName(preference?.formMetadata.key, option.key))
      )
    )

    return keys
  }, [preferences])

  const watchPreferences = watch(allOptionFieldNames)

  const uncheckPreference = (metaKey: string, options: FormMetadataOptions[]) => {
    const preferenceKeys = options?.map((option) => option.key)
    preferenceKeys.forEach((k) => setValue(getPreferenceOptionName(metaKey, k), false))
  }

  /*
    It creates values for household member select input (InputType.hhMemberSelect)
  */
  const hhMmembersOptions = useMemo(() => {
    const { applicant } = application

    const primaryApplicant = (() => {
      if (!applicant?.firstName || !applicant?.lastName) return []

      const option = `${applicant.firstName} ${applicant.lastName}`

      return [
        {
          label: option,
          value: option,
        },
      ]
    })()

    const otherMembers =
      application.householdMembers?.map((item) => {
        const option = `${item.firstName} ${item.lastName}`
        return {
          label: option,
          value: option,
        }
      }) || []

    return [...primaryApplicant, ...otherMembers]
  }, [application])

  if (!clientLoaded || !preferenceCheckboxIds) {
    return null
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
        </div>

        {!!Object.keys(errors).length && (
          <AlertBox type="alert" inverted closeable>
            {t("errors.errorsToResolve")}
          </AlertBox>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <>
            <div className="form-card__group px-0 pb-0">
              <p className="field-note">{t("application.preferences.selectBelow")}</p>
            </div>

            {preferences?.map((preference, index) => {
              const noneOptionKey = `${PREFERENCES_NONE_FORM_PATH}.${preference.formMetadata.key}-none`

              return (
                <div key={preference.id}>
                  <div
                    className={`form-card__group px-0 ${
                      index + 1 !== preferences.length ? "border-b" : ""
                    }`}
                  >
                    {console.log()}
                    <fieldset>
                      <legend className="field-label--caps mb-8">{preference.title}</legend>

                      {preference?.formMetadata?.options?.map((option) => {
                        return (
                          <div className="mb-5" key={option.key}>
                            <div
                              className={`mb-5 field ${
                                resolveObject(noneOptionKey, errors) ? "error" : ""
                              }`}
                            >
                              <Field
                                id={getPreferenceOptionName(
                                  preference.formMetadata.key,
                                  option.key
                                )}
                                name={getPreferenceOptionName(
                                  preference.formMetadata.key,
                                  option.key
                                )}
                                type="checkbox"
                                label={t(
                                  `application.preferences.${preference.formMetadata.key}.${option.key}.label`
                                )}
                                register={register}
                                inputProps={{
                                  onChange: () => {
                                    setTimeout(() => {
                                      setValue(noneOptionKey, false)
                                      void trigger(noneOptionKey)
                                    }, 1)
                                  },
                                }}
                              />
                            </div>

                            <div className="ml-8 -mt-3">
                              <ExpandableContent>
                                <p className="field-note mb-8">
                                  {t(
                                    `application.preferences.${preference.formMetadata.key}.${option.key}.description`
                                  )}
                                  <br />
                                  {preference?.links?.map((link) => (
                                    <a key={link.url} className="block pt-2" href={link.url}>
                                      {link.title}
                                    </a>
                                  ))}
                                </p>
                              </ExpandableContent>
                            </div>

                            {watchPreferences[
                              getPreferenceOptionName(preference.formMetadata.key, option.key)
                            ] &&
                              option.extraData?.map((extra) => (
                                <ExtraField
                                  key={extra.key}
                                  metaKey={preference.formMetadata.key}
                                  optionKey={option.key}
                                  extraKey={extra.key}
                                  type={extra.type}
                                  register={register}
                                  errors={errors}
                                  hhMembersOptions={hhMmembersOptions}
                                />
                              ))}
                          </div>
                        )
                      })}

                      {preference?.formMetadata && (
                        <div
                          className={`mb-5 field ${
                            resolveObject(noneOptionKey, errors) ? "error" : ""
                          }`}
                        >
                          <Field
                            id={noneOptionKey}
                            name={noneOptionKey}
                            type="checkbox"
                            label={t("application.preferences.dontWant")}
                            register={register}
                            inputProps={{
                              onChange: (e) => {
                                if (e.target.checked) {
                                  setValue(noneOptionKey, true)

                                  uncheckPreference(
                                    preference.formMetadata.key,
                                    preference.formMetadata?.options
                                  )
                                  void trigger(noneOptionKey)
                                }
                              },
                            }}
                            validation={{
                              validate: {
                                somethingIsChecked: (value) =>
                                  value ||
                                  preferenceCheckboxIds[
                                    preference.formMetadata.key
                                  ].some((option) => getValues(option)),
                              },
                            }}
                          />
                        </div>
                      )}
                    </fieldset>
                  </div>
                </div>
              )
            })}

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
          </>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default PreferencesAll
