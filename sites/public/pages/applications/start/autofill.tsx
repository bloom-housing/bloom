import useSWR from "swr"
import { useContext, useState } from "react"
import { Application } from "@bloom-housing/backend-core/types"
import {
  ApiClientContext,
  AppearanceStyleType,
  Button,
  Form,
  FormCard,
  ProgressNav,
  UserContext,
  blankApplication,
  t,
} from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import FormSummaryDetails from "../../../src/forms/applications/FormSummaryDetails"
import AutofillCleaner from "../../../lib/appAutofill"

export default () => {
  const context = useFormConductor("autofill")
  const { conductor, application, listing } = context
  const { initialStateLoaded, profile } = useContext(UserContext)
  const { applicationsService } = useContext(ApiClientContext)
  const [previousApplication, setPreviousApplication] = useState<Application>(null)

  const currentPageSection = 1
  let useDetails = false

  /* Form Handler */
  const { handleSubmit } = useForm()
  const onSubmit = () => {
    if (previousApplication && useDetails) {
      conductor.application = previousApplication
    } else {
      conductor.application = blankApplication()
    }
    context.syncApplication(conductor.application)
    conductor.sync()
    conductor.routeToNextOrReturnUrl()
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
    <FormsLayout>
      <FormCard header={listing?.name}>
        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
        />
      </FormCard>

      <FormCard>
        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless mt-4">
            Save time by using the details from your last application
          </h2>
        </div>
        <div className="form-card__pager-row px-16">
          <p className="field-note py-2">
            We'll simply pre-fill your application with the following details, and you can make
            updates as you go.
          </p>
        </div>
        <FormSummaryDetails application={previousApplication} editMode={false} />
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => {
                  useDetails = true
                }}
              >
                {"Start with these details"}
              </Button>
            </div>
            <div className="form-card__pager-row">
              <Button
                unstyled={true}
                className="mb-4"
                onClick={() => {
                  useDetails = false
                }}
              >
                {"Reset and start fresh"}
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
