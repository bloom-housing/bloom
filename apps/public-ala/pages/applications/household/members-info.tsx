/*
2.1a - Member Info
A notice regarding adding household members
*/
import React from "react"
import { useRouter } from "next/router"
import {
  AppearanceStyleType,
  AlertBox,
  Button,
  Form,
  FormCard,
  ProgressNav,
  t,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import FormBackLink from "../../../src/forms/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"

export default () => {
  const { conductor, application, listing } = useFormConductor("householdMemberInfo")
  const router = useRouter()
  const currentPageSection = 2

  /* Form Handler */
  const { handleSubmit, errors } = useForm({
    shouldFocusError: false,
  })
  const onSubmit = () => {
    void router.push("/applications/household/add-members").then(() => window.scrollTo(0, 0))
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
        <FormBackLink url={conductor.determinePreviousUrl()} />

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
                type={AppearanceStyleType.primary}
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
