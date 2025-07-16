import React, { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Alert, FormErrorMessage } from "@bloom-housing/ui-seeds"
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
import ApplicationFormLayout from "../../../layouts/application-form"
import styles from "../../../layouts/application-form.module.scss"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const ApplicationAda = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("adaHouseholdMembers")
  //todo figure out logic to only check for false/save as false if enabled
  // does that matter?
  const enableAdaOtherOption = conductor.config.featureFlags?.some(
    (flag) => flag.name === FeatureFlagEnum.enableAdaOtherOption && flag.active
  )
  const currentPageSection = 2

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, setValue, errors, getValues, clearErrors, trigger } = useForm<
    Record<string, any>
  >({
    defaultValues: {
      none:
        (application.accessibility.mobility === false &&
          application.accessibility.vision === false &&
          application.accessibility.hearing === false &&
          !enableAdaOtherOption) ||
        (enableAdaOtherOption && application.accessibility.other),
    },
    shouldFocusError: false,
  })

  const onSubmit = async (data) => {
    const validation = await trigger()
    if (!validation) return
    conductor.currentStep.save({
      accessibility: {
        mobility: !!data["app-accessibility-mobility"],
        vision: !!data["app-accessibility-vision"],
        hearing: !!data["app-accessibility-hearing"],
        other: enableAdaOtherOption ? !!data["app-accessibility-other"] : null,
      },
    })
    conductor.sync()
    conductor.routeToNextOrReturnUrl()
  }
  const onError = () => {
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - ADA Household Members",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const adaFeaturesOptions: FieldSingle[] = adaFeatureKeys
    .filter((item) => {
      return item === "other" ? enableAdaOtherOption : true
    })
    .map((item) => {
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
      application.accessibility["mobility"] === false &&
      application.accessibility["hearing"] === false &&
      application.accessibility["vision"] === false &&
      !application.accessibility["other"],
    dataTestId: `app-ada-none`,
    uniqueName: true,
    inputProps: {
      onChange: (e) => {
        if (e.target.checked) {
          setValue("app-accessibility-no-features", true)
          setValue("app-accessibility-mobility", false)
          setValue("app-accessibility-vision", false)
          setValue("app-accessibility-hearing", false)
          setValue("app-accessibility-other", false)
          clearErrors()
        }
      },
    },
  })

  return (
    <FormsLayout>
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
          {Object.entries(errors).length === Object.keys(getValues()).length &&
            Object.keys(getValues()).length > 0 && (
              <Alert
                className={styles["message-inside-card"]}
                variant="alert"
                fullwidth
                id={"application-alert-box"}
              >
                {t("errors.errorsToResolve")}
              </Alert>
            )}

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
