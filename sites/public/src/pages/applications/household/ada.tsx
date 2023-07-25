/*
2.4.c ADA Household Members
If any, the applicant can select the type of ADA needed in the household.
https://github.com/bloom-housing/bloom/issues/266
*/
import React, { useContext, useEffect } from "react"
import { FormErrorMessage } from "@bloom-housing/ui-seeds"
import {
  AppearanceStyleType,
  AlertBox,
  Button,
  Form,
  FormCard,
  ProgressNav,
  t,
  FieldGroup,
  FieldSingle,
  Heading,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import FormBackLink from "../../../components/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"
import {
  OnClientSide,
  PageView,
  pushGtmEvent,
  adaFeatureKeys,
  AuthContext,
} from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../../lib/constants"

const ApplicationAda = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("adaHouseholdMembers")
  const currentPageSection = 2

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, setValue, errors, getValues, clearErrors } = useForm<
    Record<string, any>
  >({
    defaultValues: {
      none:
        application.accessibility.mobility === false &&
        application.accessibility.vision === false &&
        application.accessibility.hearing === false,
    },
    shouldFocusError: false,
  })

  const onSubmit = (data) => {
    conductor.currentStep.save({
      accessibility: {
        mobility: !!data["app-accessibility-mobility"],
        vision: !!data["app-accessibility-vision"],
        hearing: !!data["app-accessibility-hearing"],
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

  const adaFeaturesOptions: FieldSingle[] = adaFeatureKeys.map((item) => {
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
      application.accessibility["vision"] === false,
    dataTestId: `app-ada-none`,
    uniqueName: true,
    inputProps: {
      onChange: (e) => {
        if (e.target.checked) {
          setValue("app-accessibility-no-features", true)
          setValue("app-accessibility-mobility", false)
          setValue("app-accessibility-vision", false)
          setValue("app-accessibility-hearing", false)
          clearErrors()
        }
      },
    },
  })

  return (
    <FormsLayout>
      <FormCard header={<Heading priority={1}>{listing?.name}</Heading>}>
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
          <h2 className="form-card__title is-borderless">{t("application.ada.title")}</h2>

          <p className="field-note mt-5">{t("application.ada.subTitle")}</p>
        </div>

        {Object.entries(errors).length === Object.keys(getValues()).length &&
          Object.keys(getValues()).length > 0 && (
            <AlertBox type="alert" inverted closeable>
              {t("errors.errorsToResolve")}
            </AlertBox>
          )}

        <div className="form-card__group">
          <fieldset>
            <legend className="sr-only">{t("application.details.adaPriorities")}</legend>
            <FieldGroup
              type="checkbox"
              name="app-accessibility"
              fields={adaFeaturesOptions}
              register={register}
              fieldGroupClassName="grid grid-cols-1 mt-4"
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
        </div>

        <Form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => {
                  conductor.returnToReview = false
                  conductor.setNavigatedBack(false)
                }}
                data-testid={"app-next-step-button"}
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

export default ApplicationAda
