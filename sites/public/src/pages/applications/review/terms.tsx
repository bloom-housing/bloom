import React, { useCallback, useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import Markdown from "markdown-to-jsx"
import { t, Field, Form, AlertBox } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  OnClientSide,
  PageView,
  pushGtmEvent,
  AuthContext,
  listingSectionQuestions,
  MessageContext,
} from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import { isFeatureFlagOn, untranslateMultiselectQuestion } from "../../../lib/helpers"
import {
  ApplicationReviewStatusEnum,
  FeatureFlagEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import ApplicationFormLayout from "../../../layouts/application-form"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import styles from "../../../layouts/application-form.module.scss"

const ApplicationTerms = () => {
  const router = useRouter()
  const { conductor, application, listing } = useFormConductor("terms")
  const { applicationsService, authService, loadProfile, profile } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)
  const [apiError, setApiError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sessionVoided, setSessionVoided] = useState(false)

  const closeCallback = useCallback(async () => {
    await router.push("/sign-in")
    void loadProfile()
  }, [router, loadProfile])

  let currentPageSection = 4
  if (listingSectionQuestions(listing, MultiselectQuestionsApplicationSectionEnum.programs)?.length)
    currentPageSection += 1
  if (
    listingSectionQuestions(listing, MultiselectQuestionsApplicationSectionEnum.preferences)?.length
  )
    currentPageSection += 1
  const applicationDueDate = new Date(listing?.applicationDueDate).toDateString()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data) => {
    // blocks multiple clicks and previously submitted applications
    if (!submitting && !application.confirmationCode) {
      setSubmitting(true)
      const acceptedTerms = data.agree
      conductor.currentStep.save({ acceptedTerms })
      application.acceptedTerms = acceptedTerms
      application.completedSections = 6

      if (!isFeatureFlagOn(conductor.config, FeatureFlagEnum.enableFullTimeStudentQuestion)) {
        application.applicant.fullTimeStudent = null
        application.householdMember.forEach((member) => {
          member.fullTimeStudent = null
        })
      }

      if (application?.programs?.length) {
        untranslateMultiselectQuestion(application.programs, listing)
      }
      if (application.preferences?.length) {
        untranslateMultiselectQuestion(application.preferences, listing)
      }

      if (application.demographics.spokenLanguage === "notListed") {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        application.demographics.spokenLanguage = `${application.demographics.spokenLanguage}:${application.demographics.spokenLanguageNotListed}`
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete application.demographics.spokenLanguageNotListed

      authService
        .requestNewToken()
        .then(() => {
          applicationsService
            .submit({
              body: {
                ...application,
                reviewStatus: ApplicationReviewStatusEnum.pending,
                listings: {
                  id: listing.id,
                },
                appUrl: window.location.origin,
                ...(profile && {
                  user: {
                    id: profile.id,
                  },
                }),
                // TODO remove this once this call is changed to the new backend
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
        })
        .catch((e) => {
          // We need to have a valid user when submitting an application.
          // If their session is no longer valid we should send them back to login
          // This can happen either by auth token being too old or the user logged in a different session and voided this one
          console.error(e)
          setSessionVoided(true)
        })
    }
  }

  useEffect(() => {
    if (application.confirmationCode && router.isReady) {
      addToast(t("listings.applicationAlreadySubmitted"), { variant: "alert" })
      profile
        ? void router.push(`/${router.locale}/account/applications`)
        : void router.push(`/${router.locale}/listing/${listing.id}/${listing.urlSlug}`)
    }
  }, [application, listing, profile, router])

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Terms",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout>
      <Dialog
        isOpen={sessionVoided}
        onClose={closeCallback}
        ariaLabelledBy="session-voided-dialog-header"
        ariaDescribedBy="session-voided-dialog-content"
      >
        <Dialog.Header id="session-voided-dialog-header">
          {t("session.voided.header")}
        </Dialog.Header>
        <Dialog.Content id="session-voided-dialog-content">
          <p>
            {t("session.voided.context1")}
            {listing.name}
            {t("session.voided.context2")}
          </p>
          <p>{t("session.voided.context3")}</p>
        </Dialog.Content>
        <Dialog.Footer>
          <Button variant="primary" onClick={closeCallback} size="sm">
            {t("session.voided.ok")}
          </Button>
        </Dialog.Footer>
      </Dialog>
      <Form id="review-terms" onSubmit={handleSubmit(onSubmit)}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={t("application.review.terms.title")}
          progressNavProps={{
            currentPageSection: currentPageSection,
            completedSections: application.completedSections,
            labels: conductor.config.sections.map((label) => t(`t.${label}`)),
            mounted: OnClientSide(),
          }}
          backLink={{
            url: conductor.determinePreviousUrl(),
          }}
        >
          {apiError && (
            <AlertBox type="alert" inverted onClose={() => setApiError(false)}>
              {t("errors.alert.badRequest")}
            </AlertBox>
          )}

          <CardSection divider={"flush"} className={"border-none"}>
            <div className="markdown">
              {listing?.applicationDueDate && (
                <>
                  <Markdown options={{ disableParsingRawHTML: true }}>
                    {t("application.review.terms.textSubmissionDate", {
                      applicationDueDate: applicationDueDate,
                    })}
                  </Markdown>
                  <br />
                  <br />
                </>
              )}

              <Markdown
                options={{
                  overrides: {
                    li: {
                      component: ({ children, ...props }) => (
                        <li {...props} className="mb-5">
                          {children}
                        </li>
                      ),
                    },
                  },
                }}
              >
                {t("application.review.terms.text")}
              </Markdown>

              <div className="mt-6">
                <Field
                  id="agree"
                  name="agree"
                  type="checkbox"
                  label={t("application.review.terms.confirmCheckboxText")}
                  register={register}
                  validation={{ required: true }}
                  error={errors.agree}
                  errorMessage={t("errors.agreeError")}
                  dataTestId={"app-terms-agree"}
                />
              </div>
            </div>
          </CardSection>
          <CardSection className={styles["application-form-action-footer"]}>
            <Button
              loadingMessage={
                submitting ? t("application.review.terms.submittingApplication") : null
              }
              variant={"primary"}
              type="submit"
              id={"app-terms-submit-button"}
            >
              {t("t.submit")}
            </Button>
          </CardSection>
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationTerms
