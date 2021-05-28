import React, { useMemo, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  AlertBox,
  Form,
  FormCard,
  ProgressNav,
  Field,
  t,
  ExtraField,
  ExpandableContent,
  Button,
  AppearanceStyleType,
  resolveObject,
  mapPreferencesToApi,
  mapApiToPreferencesForm,
  getPreferenceOptionName,
  getExclusivePreferenceOptionName,
  OnClientSide,
  getExclusiveKeys,
  setExclusive,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import FormBackLink from "../../../src/forms/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"
import { FormMetadataExtraData, Preference } from "@bloom-housing/backend-core/types"

const ApplicationPreferencesAll = () => {
  const clientLoaded = OnClientSide()
  const { conductor, application, listing } = useFormConductor("preferencesAll")
  const preferences = listing?.preferences
  const uniquePages: number[] = [...Array.from(new Set(preferences?.map((item) => item.page)))]
  const [page, setPage] = useState(conductor.navigatedThroughBack ? uniquePages.length : 1)
  const [applicationPreferences, setApplicationPreferences] = useState(application.preferences)
  const preferencesByPage = preferences?.filter((item) => {
    return item.page === page
  })

  const currentPageSection = 4

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch, handleSubmit, errors, getValues, reset, trigger } = useForm({
    defaultValues: {
      application: { preferences: mapApiToPreferencesForm(applicationPreferences) },
    },
  })

  const [exclusiveKeys, setExclusiveKeys] = useState(getExclusiveKeys(preferencesByPage))

  /*
    Required to keep the form up to date before submitting this section if you're moving between pages
  */
  useEffect(() => {
    reset({
      application: { preferences: mapApiToPreferencesForm(applicationPreferences) },
    })
    setExclusiveKeys(getExclusiveKeys(preferencesByPage))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, applicationPreferences, reset])

  /*
    Collects all checkbox ids by each individual preference to see if at least one checkbox is checked per preference
    Validation is used in 'somethingIsChecked' validator.
    E.g.

    liveWork:
      application.preferences.options.liveWork.live.claimed
      application.preferences.options.liveWork.work.claimed
  */
  const preferenceCheckboxIds = useMemo(() => {
    return preferencesByPage?.reduce((acc, item) => {
      const preferenceName = item.formMetadata?.key
      const optionPaths = item.formMetadata?.options?.map((option) => {
        return getPreferenceOptionName(option.key, preferenceName)
      })
      if (!item.formMetadata.hideGenericDecline)
        optionPaths.push(getExclusivePreferenceOptionName(item?.formMetadata?.key))

      Object.assign(acc, {
        [preferenceName]: optionPaths,
      })

      return acc
    }, {})
  }, [preferencesByPage])

  /*
    Submits the form
  */
  const onSubmit = (data) => {
    const body = mapPreferencesToApi(data)
    if (uniquePages.length > 1) {
      // If we've split preferences across multiple pages, save the data in segments
      const currentPreferences = conductor.currentStep.application.preferences.filter(
        (preference) => {
          return preference.key !== body[0].key
        }
      )
      conductor.currentStep.save([...currentPreferences, body[0]])
      setApplicationPreferences([...currentPreferences, body[0]])
    } else {
      // Otherwise, submit all at once
      conductor.currentStep.save(body)
    }
    // Update to the next page if we have more pages
    if (page !== uniquePages.length) {
      setPage(page + 1)
      return
    }
    // Otherwise complete the section and move to the next URL
    conductor.completeSection(4)
    conductor.routeToNextOrReturnUrl()
  }

  /*
     Collects all checkboxs on the page across all preferences to watch for updates
  */
  const allOptionFieldNames = useMemo(() => {
    const keys = []
    preferencesByPage?.forEach((preference) =>
      preference?.formMetadata?.options.forEach((option) => {
        keys.push(getPreferenceOptionName(option.key, preference?.formMetadata?.key))
      })
    )

    return keys
  }, [preferencesByPage])

  const watchPreferences = watch(allOptionFieldNames)
  /*
    Creates values for household member select input if relevant (InputType.hhMemberSelect)
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

  /*
    Builds the JSX of a preference option
  */
  const getOption = (
    optionKey: string | null,
    optionName: string,
    description: boolean,
    exclusive: boolean,
    extraData: FormMetadataExtraData[],
    preference: Preference,
    label?: string
  ) => {
    return (
      <div className="mb-5" key={optionKey}>
        <div className={`mb-5 field ${resolveObject(optionName, errors) ? "error" : ""}`}>
          <Field
            id={optionName}
            name={optionName}
            type="checkbox"
            label={
              label ??
              t(`application.preferences.${preference.formMetadata.key}.${optionKey}.label`, {
                county: listing?.countyCode,
              })
            }
            register={register}
            inputProps={{
              onChange: (e) => {
                if (e.target.checked) {
                  void trigger()
                }
                if (exclusive && e.target.checked)
                  setExclusive(true, setValue, exclusiveKeys, optionName, preference)
                if (!exclusive) setExclusive(false, setValue, exclusiveKeys, optionName, preference)
              },
            }}
            validation={{
              validate: {
                somethingIsChecked: (value) =>
                  value ||
                  preferenceCheckboxIds[preference.formMetadata.key].some((option) =>
                    getValues(option)
                  ),
              },
            }}
          />
        </div>

        {!(description === false) && (
          <div className="ml-8 -mt-3">
            <ExpandableContent>
              <p className="field-note mb-8">
                {t(
                  `application.preferences.${preference.formMetadata.key}.${optionKey}.description`,
                  { county: listing?.countyCode }
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
        )}

        {watchPreferences[optionName] &&
          extraData.map((extra) => (
            <ExtraField
              key={extra.key}
              metaKey={preference.formMetadata.key}
              optionKey={optionKey}
              extraKey={extra.key}
              type={extra.type}
              register={register}
              errors={errors}
              hhMembersOptions={hhMmembersOptions}
            />
          ))}
      </div>
    )
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
        <FormBackLink
          url={conductor.determinePreviousUrl()}
          onClick={() => {
            conductor.setNavigatedBack(true)
            setPage(page - 1)
          }}
          custom={page === uniquePages.length}
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
          <p className="field-note">
            {preferencesByPage[0]?.formMetadata.customSelectText ??
              t("application.preferences.selectBelow")}
          </p>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <>
            {preferencesByPage?.map((preference, index) => {
              return (
                <div key={preference.id}>
                  <div
                    className={`form-card__group px-0 ${
                      index + 1 !== preferencesByPage.length ? "border-b" : ""
                    }`}
                  >
                    <fieldset>
                      <legend className="field-label--caps mb-4">{preference.title}</legend>
                      <p className="field-note mb-8">{preference.description}</p>
                      {preference?.formMetadata?.options?.map((option) => {
                        return getOption(
                          option.key,
                          getPreferenceOptionName(option.key, preference.formMetadata.key),
                          option.description,
                          option.exclusive,
                          option.extraData,
                          preference
                        )
                      })}

                      {/** If we haven't hidden the generic decline, include it at the end */}
                      {preference?.formMetadata &&
                        !preference.formMetadata.hideGenericDecline &&
                        getOption(
                          null,
                          getExclusivePreferenceOptionName(preference?.formMetadata?.key),
                          false,
                          true,
                          [],
                          preference,
                          t("application.preferences.dontWant")
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
                    conductor.setNavigatedBack(false)
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

export default ApplicationPreferencesAll
