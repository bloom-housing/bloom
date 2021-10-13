/*
2.4.c ADA Household Members
If any, the applicant can select the type of ADA needed in the household.
https://github.com/bloom-housing/bloom/issues/266
*/
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
import { useForm } from "react-hook-form"
import FormBackLink from "../../../src/forms/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"

const ApplicationAda = () => {
  const { conductor, application, listing } = useFormConductor("adaHouseholdMembers")
  const currentPageSection = 2

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, getValues, setValue, trigger, errors } = useForm<
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
    conductor.completeSection(2)
    conductor.currentStep.save({
      accessibility: {
        mobility: data.mobility,
        vision: data.vision,
        hearing: data.hearing,
      },
    })
    conductor.routeToNextOrReturnUrl()
  }
  const onError = () => {
    window.scrollTo(0, 0)
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
          onClick={() => conductor.setNavigatedBack(true)}
        />

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">{t("application.ada.title")}</h2>

          <p className="field-note mt-5">{t("application.ada.subTitle")}</p>
        </div>

        {Object.entries(errors).length > 0 && (
          <AlertBox type="alert" inverted closeable>
            {t("errors.errorsToResolve")}
          </AlertBox>
        )}

        <div className="form-card__group">
          <fieldset>
            <p className="field-note mb-4">{t("errors.selectAllThatApply")}</p>

            <div className="field">
              <input
                type="checkbox"
                id="mobility"
                name="mobility"
                defaultChecked={application.accessibility.mobility}
                ref={register}
                onChange={() => {
                  setTimeout(() => {
                    setValue("none", false)
                    void trigger("none")
                  }, 1)
                }}
              />
              <label htmlFor="mobility" className="font-semibold">
                {t("application.ada.mobility")}
              </label>
            </div>

            <div className="field">
              <input
                type="checkbox"
                id="vision"
                name="vision"
                defaultChecked={application.accessibility.vision}
                ref={register}
                onChange={() => {
                  setTimeout(() => {
                    setValue("none", false)
                    void trigger("none")
                  }, 1)
                }}
              />
              <label htmlFor="vision" className="font-semibold">
                {t("application.ada.vision")}
              </label>
            </div>

            <div className="field">
              <input
                type="checkbox"
                id="hearing"
                name="hearing"
                defaultChecked={application.accessibility.hearing}
                ref={register}
                onChange={() => {
                  setTimeout(() => {
                    setValue("none", false)
                    void trigger("none")
                  }, 1)
                }}
              />
              <label htmlFor="hearing" className="font-semibold">
                {t("application.ada.hearing")}
              </label>
            </div>

            <div className={"field " + (errors.none ? "error" : "")}>
              <input
                aria-describedby="accessibilityCheckboxGroupError"
                aria-invalid={!!errors.none || false}
                type="checkbox"
                id="none"
                name="none"
                ref={register({
                  validate: {
                    somethingIsChecked: (value) =>
                      value || getValues("mobility") || getValues("vision") || getValues("hearing"),
                  },
                })}
                onChange={(e) => {
                  if (e.target.checked) {
                    setValue("none", true)
                    setValue("mobility", false)
                    setValue("vision", false)
                    setValue("hearing", false)
                    void trigger("none")
                  }
                }}
              />
              <label htmlFor="none" className="font-semibold">
                {t("t.no")}
              </label>

              <ErrorMessage id="accessibilityCheckboxGroupError" error={errors.none}>
                {t("errors.selectOption")}
              </ErrorMessage>
            </div>
          </fieldset>
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
