import React, { useCallback, useMemo, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  // AlertBox,
  Form,
  FormCard,
  ProgressNav,
  Field,
  t,
  ExtraField,
  PREFERENCES_FORM_PATH,
  ExpandableContent,
  Button,
  AppearanceStyleType,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import FormBackLink from "../../../src/forms/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"
import { FormMetadataOptions } from "@bloom-housing/backend-core/types"

const PreferencesStart = () => {
  const { conductor, application, listing } = useFormConductor("preferencesStart")
  const preferences = listing?.preferences

  const currentPageSection = 4

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch, handleSubmit, errors } = useForm()

  const onSubmit = (data) => {
    console.log("submit", data)
    // conductor.currentStep.save({ ...data })
    // conductor.routeToNextOrReturnUrl()
  }

  const buildOptionName = useCallback((metaKey: string, option: string) => {
    return `${PREFERENCES_FORM_PATH}.${metaKey}.${option}.claimed`
  }, [])

  const allOptionFieldNames = useMemo(() => {
    const keys = []
    preferences?.forEach((preference) =>
      preference?.formMetadata?.options.forEach((option) =>
        keys.push(buildOptionName(preference?.formMetadata.key, option.key))
      )
    )

    return keys
  }, [preferences, buildOptionName])

  const watchPreferences = watch(allOptionFieldNames)

  function uncheckPreference(metaKey: string, options: FormMetadataOptions[]) {
    const preferenceKeys = options?.map((option) => option.key)
    preferenceKeys.forEach((k) => setValue(buildOptionName(metaKey, k), false))
  }

  const hhMmembersOptions = useMemo(() => {
    const { applicant } = application

    const option = `${applicant.firstName} ${applicant.lastName}`
    const primaryApplicant = {
      label: option,
      value: option,
    }

    const otherMembers =
      application.householdMembers?.map((item) => {
        const option = `${item.firstName} ${item.lastName}`
        return {
          label: option,
          value: option,
        }
      }) || []

    return [primaryApplicant, ...otherMembers]
  }, [application])

  // fix for rehydration
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])
  if (!hasMounted) {
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

        {/* {Object.entries(errors).length > 0 && (
          <AlertBox type="alert" inverted closeable>
            {t("errors.errorsToResolve")}
          </AlertBox>
        )} */}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <>
            <div className="form-card__group px-0 pb-3">
              <p className="field-note">{t("application.preferences.selectBelow")}</p>
            </div>

            {preferences?.map((preference) => (
              <div>
                <fieldset className="form-card__group px-0 border-b">
                  <p className="field-note mb-8">{preference.title}</p>

                  {preference?.formMetadata?.options?.map((option) => {
                    return (
                      <div className="mb-5" key={option.key}>
                        <Field
                          id={buildOptionName(preference.formMetadata.key, option.key)}
                          name={buildOptionName(preference.formMetadata.key, option.key)}
                          type="checkbox"
                          label={t(
                            `application.preferences.${preference.formMetadata.key}.${option.key}.label`
                          )}
                          register={register}
                          inputProps={{
                            onChange: () => {
                              setValue(`${preference.formMetadata.key}-none`, false)
                            },
                          }}
                        />

                        <div className="ml-8 -mt-3">
                          <ExpandableContent>
                            <p className="field-note mt-6">
                              {t(
                                `application.preferences.${preference.formMetadata.key}.${option.key}.description`
                              )}
                              <br />
                              {preference?.links?.map((link) => (
                                <a className="block pt-2" href={link.url}>
                                  {link.title}
                                </a>
                              ))}
                            </p>
                          </ExpandableContent>
                        </div>

                        {watchPreferences[
                          buildOptionName(preference.formMetadata.key, option.key)
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
                    <Field
                      id={`${preference.formMetadata.key}-none`}
                      name={`${preference.formMetadata.key}-none`}
                      type="checkbox"
                      label={t("t.none")}
                      register={register}
                      inputProps={{
                        onChange: () =>
                          uncheckPreference(
                            preference.formMetadata.key,
                            preference.formMetadata?.options
                          ),
                      }}
                    />
                  )}
                </fieldset>
              </div>
            ))}

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

export default PreferencesStart
