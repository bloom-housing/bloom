import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { Alert, Button } from "@bloom-housing/ui-seeds"
import { Form, setSiteAlertMessage, t } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  OnClientSide,
  PageView,
  pushGtmEvent,
  AuthContext,
  listingSectionQuestions,
} from "@bloom-housing/shared-helpers"
import { ApplicationReviewStatus, ApplicationSection } from "@bloom-housing/backend-core"
import FormsLayout from "../../../layouts/forms"
import FormSummaryDetails from "../../../components/shared/FormSummaryDetails"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout from "../../../layouts/application-form"
import styles from "../../../layouts/application-form.module.scss"

const ApplicationSummary = () => {
  const router = useRouter()
  const { profile, applicationsService } = useContext(AuthContext)
  const [validationError, setValidationError] = useState(false)
  const { conductor, application, listing } = useFormConductor("summary")
  let currentPageSection = 4
  if (listingSectionQuestions(listing, ApplicationSection.programs)?.length) currentPageSection += 1
  if (listingSectionQuestions(listing, ApplicationSection.preferences)?.length)
    currentPageSection += 1

  const { handleSubmit } = useForm()

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Summary",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  useEffect(() => {
    if (listing?.status === "closed") {
      setSiteAlertMessage(t("listings.applicationsClosedRedirect"), "alert")
      void router.push(`/${router.locale}/listing/${listing?.id}/${listing.urlSlug}`)
    }
  }, [listing, router])

  const onSubmit = () => {
    applicationsService
      .submissionValidation({
        body: {
          ...application,
          reviewStatus: ApplicationReviewStatus.pending,
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
      .then(() => {
        conductor.routeToNextOrReturnUrl()
      })
      .catch(() => {
        setValidationError(true)
        window.scrollTo(0, 0)
      })
  }

  return (
    <FormsLayout>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={t("application.review.takeAMomentToReview")}
          progressNavProps={{
            currentPageSection: currentPageSection,
            completedSections: application.completedSections,
            labels: conductor.config.sections.map((label) => t(`t.${label}`)),
            mounted: OnClientSide(),
          }}
          backLink={{
            url: conductor.determinePreviousUrl(),
          }}
          hideBorder={true}
        >
          {validationError && (
            <Alert className={styles["message-inside-card"]} variant="alert" fullwidth>
              {t("errors.alert.applicationSubmissionVerificationError")}
            </Alert>
          )}

          <FormSummaryDetails
            application={application}
            listing={listing}
            hidePreferences={
              listingSectionQuestions(listing, ApplicationSection.preferences)?.length === 0
            }
            hidePrograms={
              listingSectionQuestions(listing, ApplicationSection.programs)?.length === 0
            }
            editMode
            validationError={validationError}
          />

          <CardSection divider={"flush"} className={"border-none"}>
            <p className="field-note text-gray-800">{t("application.review.lastChanceToEdit")}</p>
          </CardSection>

          <CardSection className={"bg-primary-lighter"}>
            <Button
              variant={"primary"}
              id={"app-summary-confirm"}
              disabled={validationError}
              type={"submit"}
            >
              {t("t.confirm")}
            </Button>
          </CardSection>
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationSummary
