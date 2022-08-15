/*
5.3 Terms
View of application terms with checkbox
*/
import React, { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import {
  AppearanceStyleType,
  Button,
  FormCard,
  t,
  FieldGroup,
  Form,
  AlertBox,
  ProgressNav,
} from "@bloom-housing/ui-components"
import { ApplicationSection } from "@bloom-housing/backend-core"
import { useForm } from "react-hook-form"
import Markdown from "markdown-to-jsx"
import {
  OnClientSide,
  PageView,
  pushGtmEvent,
  AuthContext,
  listingSectionQuestions,
} from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"

const ApplicationTerms = () => {
  const router = useRouter()
  const { conductor, application, listing } = useFormConductor("terms")
  const { applicationsService, profile } = useContext(AuthContext)
  const [apiError, setApiError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  let currentPageSection = 4
  if (listingSectionQuestions(listing, ApplicationSection.programs).length) currentPageSection += 1
  if (listingSectionQuestions(listing, ApplicationSection.preferences).length)
    currentPageSection += 1
  const applicationDueDate = new Date(listing?.applicationDueDate).toDateString()

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data) => {
    setSubmitting(true)
    const acceptedTerms = data.agree === "agree"
    conductor.currentStep.save({ acceptedTerms })
    application.acceptedTerms = acceptedTerms
    application.completedSections = 6
    applicationsService
      .submit({
        body: {
          ...application,
          listing: {
            id: listing.id,
          },
          appUrl: window.location.origin,
          ...(profile && {
            user: {
              id: profile.id,
            },
          }),
        },
      })
      .then((result) => {
        conductor.currentStep.save({ confirmationCode: result.confirmationCode })
        return router.push("/applications/review/confirmation")
      })
      .catch((err) => {
        setSubmitting(false)
        setApiError(true)
        window.scrollTo(0, 0)
        console.error(`Error creating application: ${err}`)
        throw err
      })
  }

  const agreeField = [
    {
      id: "agree",
      label: t("application.review.terms.confirmCheckboxText"),
    },
  ]

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Terms",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout>
      <FormCard
        header={{
          isVisible: true,
          title: listing?.name,
        }}
      >
        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
          mounted={OnClientSide()}
        />
      </FormCard>
      <FormCard>
        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">{t("application.review.terms.title")}</h2>
        </div>

        {apiError && (
          <AlertBox type="alert" inverted onClose={() => setApiError(false)}>
            {t("errors.alert.badRequest")}
          </AlertBox>
        )}

        <Form id="review-terms" className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__pager-row">
            {listing?.applicationDueDate && (
              <Markdown options={{ disableParsingRawHTML: false }}>
                {t("application.review.terms.textSubmissionDate", {
                  applicationDueDate: applicationDueDate,
                })}
              </Markdown>
            )}

            <Markdown options={{ disableParsingRawHTML: false }}>
              {t("application.review.terms.text")}
            </Markdown>

            <div className="mt-4">
              <FieldGroup
                name="agree"
                type="checkbox"
                fields={agreeField}
                register={register}
                validation={{ required: true }}
                error={errors.agree}
                errorMessage={t("errors.agreeError")}
                fieldLabelClassName={"text-primary"}
                dataTestId={"app-terms-agree"}
              />
            </div>
          </div>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                loading={submitting}
                styleType={AppearanceStyleType.primary}
                type="submit"
                data-test-id={"app-terms-submit-button"}
              >
                {t("t.submit")}
              </Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default ApplicationTerms
