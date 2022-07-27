import { useContext, useState, useEffect, useCallback } from "react"
import { Application } from "@bloom-housing/backend-core/types"
import {
  AppearanceStyleType,
  Button,
  Form,
  FormCard,
  ProgressNav,
  t,
} from "@bloom-housing/ui-components"
import {
  blankApplication,
  OnClientSide,
  PageView,
  pushGtmEvent,
  AuthContext,
} from "@bloom-housing/shared-helpers"
import { useForm } from "react-hook-form"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import FormSummaryDetails from "../../../src/forms/applications/FormSummaryDetails"
import AutofillCleaner from "../../../lib/appAutofill"
import { useRouter } from "next/router"
import { UserStatus } from "../../../lib/constants"

export default () => {
  const router = useRouter()
  const context = useFormConductor("autofill")
  const { conductor, application, listing } = context
  const { initialStateLoaded, profile, applicationsService } = useContext(AuthContext)
  const [submitted, setSubmitted] = useState(false)
  const [previousApplication, setPreviousApplication] = useState<Application>(null)

  const currentPageSection = 1
  let useDetails = false

  const mounted = OnClientSide()

  /* Form Handler */
  const { handleSubmit } = useForm()
  const onSubmit = useCallback(() => {
    if (!submitted) {
      // Necessary to avoid infinite rerenders
      setSubmitted(true)
      if (previousApplication && useDetails) {
        const withUpdatedLang = {
          ...previousApplication,
          language: router.locale,
        }

        conductor.application = withUpdatedLang
      } else {
        const newApplication = {
          ...blankApplication,
          language: router.locale,
        }
        conductor.application = newApplication
      }

      context.syncApplication(conductor.application)
      conductor.sync()
      conductor.routeToNextOrReturnUrl()
    }
  }, [submitted, previousApplication, useDetails, context, conductor, router])

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Autofill",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  useEffect(() => {
    if (!previousApplication && initialStateLoaded) {
      if (profile) {
        void applicationsService
          .list({
            userId: profile.id,
            orderBy: "createdAt",
            order: "DESC",
            limit: 1,
          })
          .then((res) => {
            if (res && res?.items?.length) {
              setPreviousApplication(new AutofillCleaner(res.items[0]).clean())
            } else {
              onSubmit()
            }
          })
      } else {
        onSubmit()
      }
    }
  }, [profile, applicationsService, onSubmit, previousApplication, initialStateLoaded])

  return previousApplication ? (
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
          mounted={mounted}
        />
      </FormCard>
      <FormCard>
        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless mt-4">
            {t("application.autofill.saveTime")}
          </h2>
        </div>
        <div className="form-card__pager-row px-16">
          <p className="field-note py-2">{t("application.autofill.prefillYourApplication")}</p>
        </div>
        <FormSummaryDetails
          application={previousApplication}
          listing={listing}
          editMode={false}
          hidePreferences={true}
          hidePrograms={true}
        />
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__pager" data-test-id={"application-initial-page"}>
            <div className="form-card__pager-row primary">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => {
                  useDetails = true
                }}
                data-test-id={"autofill-accept"}
              >
                {t("application.autofill.start")}
              </Button>
            </div>
            <div className="form-card__pager-row">
              <Button
                unstyled={true}
                className="mb-4"
                onClick={() => {
                  useDetails = false
                }}
                dataTestId={"autofill-decline"}
              >
                {t("application.autofill.reset")}
              </Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  ) : (
    <FormsLayout></FormsLayout>
  )
}
