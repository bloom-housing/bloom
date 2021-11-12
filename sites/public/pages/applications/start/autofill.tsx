import useSWR from "swr"
import { useContext, useState } from "react"
import { Application } from "@bloom-housing/backend-core/types"
import {
  AuthContext,
  AppearanceStyleType,
  Button,
  Form,
  FormCard,
  t,
} from "@bloom-housing/ui-components"
import { blankApplication } from "@bloom-housing/shared-helpers"
import { useForm } from "react-hook-form"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import FormSummaryDetails from "../../../src/forms/applications/FormSummaryDetails"
import AutofillCleaner from "../../../lib/appAutofill"

export default () => {
  const context = useFormConductor("autofill")
  const { conductor, application, listing } = context
  const { initialStateLoaded, profile, applicationsService } = useContext(AuthContext)
  const [submitted, setSubmitted] = useState(false)
  const [previousApplication, setPreviousApplication] = useState<Application>(null)

  const currentPageSection = 1
  let useDetails = false

  /* Form Handler */
  const { handleSubmit } = useForm()
  const onSubmit = () => {
    if (!submitted) {
      // Necessary to avoid infinite rerenders
      setSubmitted(true)
      if (previousApplication && useDetails) {
        const withUpdatedLang = {
          ...previousApplication,
          language: conductor.application.language,
        }

        conductor.application = withUpdatedLang
      } else {
        const newApplication = {
          ...blankApplication,
          language: conductor.application.language,
        }
        conductor.application = newApplication
      }

      context.syncApplication(conductor.application)
      conductor.sync()
      conductor.routeToNextOrReturnUrl()
    }
  }

  const fetcher = async () => {
    const res = await applicationsService.list({
      userId: profile.id,
      orderBy: "createdAt",
      order: "DESC",
      limit: 1,
    })
    return res
  }
  const { data } = useSWR(
    profile && !previousApplication ? process.env.listingServiceUrl : null,
    fetcher
  )
  if (data) {
    if (data.items.length > 0) {
      setPreviousApplication(new AutofillCleaner(data.items[0]).clean())
    } else {
      onSubmit()
    }
  } else if (initialStateLoaded && !profile) {
    onSubmit()
  }

  return previousApplication ? (
    <FormsLayout
      listingName={listing?.name}
      currentSection={currentPageSection}
      completedSections={application.completedSections}
      labels={conductor.config.sections.map((label) => t(`t.${label}`))}
    >
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
        />
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__pager">
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
                data-test-id={"autofill-decline"}
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
