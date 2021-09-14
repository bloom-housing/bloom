/*
1.4 - Alternate Contact
Type of alternate contact
*/
import {
  AppearanceStyleType,
  AlertBox,
  Button,
  Form,
  Field,
  FormCard,
  ProgressNav,
  t,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import FormBackLink from "../../../src/forms/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"

export default () => {
  const { conductor, application, listing } = useFormConductor("alternateContactName")
  const currentPageSection = 1

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm<Record<string, any>>({
    shouldFocusError: false,
  })
  const onSubmit = (data) => {
    application.alternateContact.firstName = data.firstName
    application.alternateContact.lastName = data.lastName
    application.alternateContact.agency = data.agency
    conductor.sync()
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
          <h2 className="form-card__title is-borderless">
            {t("application.alternateContact.name.title")}
          </h2>
        </div>

        {Object.entries(errors).length > 0 && (
          <AlertBox type="alert" inverted closeable>
            {t("errors.errorsToResolve")}
          </AlertBox>
        )}

        <Form id="applications-contact-alternate-name" onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="form-card__group">
            <fieldset>
              <legend className="field-label--caps">
                {t("application.alternateContact.name.alternateContactFormLabel")}
              </legend>
              <Field
                id="firstName"
                name="firstName"
                label={t("application.name.firstName")}
                readerOnly={true}
                placeholder={t("application.name.firstName")}
                defaultValue={application.alternateContact.firstName}
                validation={{ required: true }}
                error={errors.firstName}
                errorMessage={t("errors.firstNameError")}
                register={register}
              />
              <Field
                id="lastName"
                name="lastName"
                label={t("application.name.lastName")}
                readerOnly={true}
                placeholder={t("application.name.lastName")}
                defaultValue={application.alternateContact.lastName}
                validation={{ required: true }}
                error={errors.lastName}
                errorMessage={t("errors.lastNameError")}
                register={register}
              />
              {application.alternateContact.type === "caseManager" && (
                <div className="mt-6">
                  <Field
                    id="agency"
                    name="agency"
                    label={t("application.alternateContact.name.caseManagerAgencyFormLabel")}
                    caps={true}
                    placeholder={t(
                      "application.alternateContact.name.caseManagerAgencyFormPlaceHolder"
                    )}
                    defaultValue={application.alternateContact.agency}
                    validation={{ required: true }}
                    error={errors.agency}
                    errorMessage={t(
                      "application.alternateContact.name.caseManagerAgencyValidationErrorMessage"
                    )}
                    register={register}
                  />
                </div>
              )}
            </fieldset>
          </div>
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
                    conductor.setNavigatedBack(false)
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
