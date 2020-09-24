/*
2.1a - Member Info
A notice regarding adding household members
*/
import { useContext, useEffect } from "react"
import Link from "next/link"
import Router from "next/router"
import { AlertBox, Button, Form, FormCard, ProgressNav, t } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import FormBackLink from "../../../src/forms/applications/FormBackLink"

export default () => {
  const { conductor, application, listing } = useContext(AppSubmissionContext)
  const currentPageSection = 2

  conductor.stepTo("Household Member Info")
  useEffect(() => {
    conductor.skipCurrentStepIfNeeded()
  }, [application, conductor])

  /* Form Handler */
  const { register, handleSubmit, errors } = useForm({
    shouldFocusError: false,
  })
  const onSubmit = (data) => {
    Router.push("/applications/household/add-members").then(() => window.scrollTo(0, 0))
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
          labels={conductor.config.sections}
        />
      </FormCard>

      <FormCard>
        <FormBackLink conductor={conductor} />

        <div className="form-card__lead">
          <h2 className="form-card__title is-borderless mt-4">
            {t("application.household.membersInfo.title")}
          </h2>
        </div>

        {Object.entries(errors).length > 0 && (
          <AlertBox type="alert" inverted closeable>
            {t("t.errorsToResolve")}
          </AlertBox>
        )}

        <Form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                filled={true}
                onClick={() => {
                  //
                }}
              >
                {t("t.next")}
              </Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}
