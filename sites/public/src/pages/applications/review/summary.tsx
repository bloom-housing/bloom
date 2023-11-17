/*
5.2 Summary
Display a summary of application fields with edit links per section
*/
import React, { useContext, useEffect, useState } from "react"
import {
  AppearanceStyleType,
  Button,
  FormCard,
  t,
  Form,
  ProgressNav,
  Heading,
  AlertBox,
  setSiteAlertMessage,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import FormSummaryDetails from "../../../components/shared/FormSummaryDetails"
import { useFormConductor } from "../../../lib/hooks"
import {
  OnClientSide,
  PageView,
  pushGtmEvent,
  AuthContext,
  listingSectionQuestions,
} from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../../lib/constants"
import { useRouter } from "next/router"
import {
  ApplicationCreate,
  ApplicationReviewStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const ApplicationSummary = () => {
  const router = useRouter()
  const { profile, applicationsService } = useContext(AuthContext)
  const [validationError, setValidationError] = useState(false)
  const { conductor, application, listing } = useFormConductor("summary")
  let currentPageSection = 4
  if (listingSectionQuestions(listing, MultiselectQuestionsApplicationSectionEnum.programs)?.length)
    currentPageSection += 1
  if (
    listingSectionQuestions(listing, MultiselectQuestionsApplicationSectionEnum.preferences)?.length
  )
    currentPageSection += 1

  /* Form Handler */
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
          reviewStatus: ApplicationReviewStatusEnum.pending,
          listing: {
            id: listing.id,
          },
          appUrl: window.location.origin,
          ...(profile && {
            user: {
              id: profile.id,
            },
          }),
        } as unknown as ApplicationCreate,
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
      <FormCard header={<Heading priority={1}>{listing?.name}</Heading>}>
        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
          mounted={OnClientSide()}
        />
      </FormCard>
      <FormCard>
        <div className="form-card__lead">
          <h2 className="form-card__title is-borderless">
            {t("application.review.takeAMomentToReview")}
          </h2>
        </div>
        {validationError && (
          <AlertBox type="alert" inverted>
            {t("errors.alert.applicationSubmissionVerificationError")}
          </AlertBox>
        )}

        <FormSummaryDetails
          application={application}
          listing={listing}
          hidePreferences={
            listingSectionQuestions(listing, MultiselectQuestionsApplicationSectionEnum.preferences)
              ?.length === 0
          }
          hidePrograms={
            listingSectionQuestions(listing, MultiselectQuestionsApplicationSectionEnum.programs)
              ?.length === 0
          }
          editMode
          validationError={validationError}
        />

        <div className="form-card__group">
          <p className="field-note text-gray-800 text-center">
            {t("application.review.lastChanceToEdit")}
          </p>
        </div>

        <div className="form-card__pager">
          <div className="form-card__pager-row primary">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Button
                styleType={
                  validationError ? AppearanceStyleType.closed : AppearanceStyleType.primary
                }
                data-testid={"app-summary-confirm"}
                disabled={validationError}
              >
                {t("t.confirm")}
              </Button>
            </Form>
          </div>
        </div>
      </FormCard>
    </FormsLayout>
  )
}

export default ApplicationSummary
