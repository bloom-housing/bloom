/*
5.2 Summary
Display a summary of application fields with edit links per section
*/
import React, { useContext, useEffect } from "react"
import {
  AppearanceStyleType,
  Button,
  FormCard,
  t,
  Form,
  ProgressNav,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import FormSummaryDetails from "../../../src/forms/applications/FormSummaryDetails"
import { useFormConductor } from "../../../lib/hooks"
import {
  OnClientSide,
  PageView,
  pushGtmEvent,
  AuthContext,
  listingSectionQuestions,
} from "../../../shared"
import { UserStatus } from "../../../lib/constants"
import { ApplicationSection } from "@bloom-housing/backend-core"

const ApplicationSummary = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("summary")
  let currentPageSection = 4
  if (listingSectionQuestions(listing, ApplicationSection.programs)?.length) currentPageSection += 1
  if (listingSectionQuestions(listing, ApplicationSection.preferences)?.length)
    currentPageSection += 1

  /* Form Handler */
  const { handleSubmit } = useForm()
  const onSubmit = () => conductor.routeToNextOrReturnUrl()

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Summary",
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
        <div className="form-card__lead">
          <h2 className="form-card__title is-borderless">
            {t("application.review.takeAMomentToReview")}
          </h2>
        </div>

        <FormSummaryDetails
          application={application}
          listing={listing}
          hidePreferences={
            listingSectionQuestions(listing, ApplicationSection.preferences)?.length === 0
          }
          hidePrograms={listingSectionQuestions(listing, ApplicationSection.programs)?.length === 0}
          editMode
        />

        <div className="form-card__group">
          <p className="field-note text-gray-800 text-center">
            {t("application.review.lastChanceToEdit")}
          </p>
        </div>

        <div className="form-card__pager">
          <div className="form-card__pager-row primary">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Button styleType={AppearanceStyleType.primary} data-test-id={"app-summary-confirm"}>
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
