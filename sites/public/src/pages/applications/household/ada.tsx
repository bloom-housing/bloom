import React, { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { FormErrorMessage } from "@bloom-housing/ui-seeds"
import { Form, t, FieldGroup, FieldSingle } from "@bloom-housing/ui-components"
import {
  OnClientSide,
  PageView,
  pushGtmEvent,
  adaFeatureKeys,
  AuthContext,
} from "@bloom-housing/shared-helpers"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout, {
  ApplicationAlertBox,
  onFormError,
} from "../../../layouts/application-form"

const ApplicationAda = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("adaHouseholdMembers")
  const currentPageSection = 2
  const visibleAdaFeatureKeys = conductor.config?.visibleApplicationAccessibilityFeatures || []
  const orderedVisibleAdaFeatureKeys = visibleAdaFeatureKeys.sort((a, b) => {
    if (a === "other") return 1
    if (b === "other") return -1
    return 0
  })
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, setValue, errors, getValues, clearErrors, trigger } = useForm<
    Record<string, unknown>
  >({
    defaultValues: {
      none:
        visibleAdaFeatureKeys.length > 0 &&
        visibleAdaFeatureKeys.every((feature) => application.accessibility?.[feature] === false),
    },
    shouldFocusError: false,
  })

  const onSubmit = async (data) => {
    const validation = await trigger()
    if (!validation) return
    const accessibility = adaFeatureKeys.reduce<Record<string, boolean | null>>((acc, feature) => {
      acc[feature] = !!data[`app-accessibility-${feature}`]
      return acc
    }, {})

    conductor.currentStep.save({
      accessibility,
    })
    conductor.sync()
    conductor.routeToNextOrReturnUrl()
  }
  const onError = () => {
    onFormError()
  }

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - ADA Household Members",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const adaFeaturesOptions: FieldSingle[] = orderedVisibleAdaFeatureKeys.map((item) => {
    const isChecked = application.accessibility[item]

    return {
      id: item,
      label: t(`application.ada.${item}`),
      value: item,
      defaultChecked: isChecked,
      dataTestId: `app-ada-${item}`,
      uniqueName: true,
      inputProps: {
        onChange: () => {
          setTimeout(() => {
            setValue("app-accessibility-no-features", false)
            clearErrors()
          }, 1)
        },
      },
    }
  })

  adaFeaturesOptions.push({
    id: "no-features",
    label: t(`t.no`),
    value: "no-features",
    defaultChecked:
      visibleAdaFeatureKeys.length > 0 &&
      visibleAdaFeatureKeys.every((feature) => application.accessibility?.[feature] === false),
    dataTestId: `app-ada-none`,
    uniqueName: true,
    inputProps: {
      onChange: (e) => {
        if (e.target.checked) {
          setValue("app-accessibility-no-features", true)
          visibleAdaFeatureKeys.forEach((feature) => {
            setValue(`app-accessibility-${feature}`, false)
          })
          clearErrors()
        }
      },
    },
  })

  return (
    <FormsLayout
      pageTitle={`${t("pageTitle.adaFeatures")} - ${t("listings.apply.applyOnline")} - ${
        listing?.name
      }`}
    >
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={t("application.ada.title")}
          subheading={t("application.ada.subTitle")}
          progressNavProps={{
            currentPageSection: currentPageSection,
            completedSections: application.completedSections,
            labels: conductor.config.sections.map((label) => t(`t.${label}`)),
            mounted: OnClientSide(),
          }}
          backLink={{
            url: conductor.determinePreviousUrl(),
          }}
          conductor={conductor}
        >
          <ApplicationAlertBox errors={errors} />
          <CardSection divider={"flush"} className={"border-none"}>
            <fieldset>
              <legend className="sr-only">{t("application.details.adaPriorities")}</legend>
              <FieldGroup
                type="checkbox"
                name="app-accessibility"
                fields={adaFeaturesOptions}
                register={register}
                fieldGroupClassName="grid grid-cols-1 mt-4"
                groupNote={t("application.household.preferredUnit.optionsLabel")}
                fieldClassName="ml-0"
                validation={{
                  validate: () => {
                    return !!Object.values(getValues()).filter((value) => value).length
                  },
                }}
                error={
                  Object.keys(errors).length === Object.keys(getValues()).length &&
                  Object.keys(getValues()).length > 0
                }
              />
            </fieldset>
            {!!Object.keys(errors).length && (
              <FormErrorMessage id="accessibilityCheckboxGroupError">
                {t("errors.selectOption")}
              </FormErrorMessage>
            )}
          </CardSection>
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationAda
