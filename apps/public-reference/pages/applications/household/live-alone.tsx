/*
2.1 - Live Alone
Asks whether the applicant will be adding any additional household members
*/
import Link from "next/link"
import Router from "next/router"
import {
  Button,
  FormCard,
  ProgressNav,
  t,
  HouseholdSizeField,
  Form,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import { useContext, useMemo, useState } from "react"
import FormBackLink from "../../../src/forms/applications/FormBackLink"

export default () => {
  const { conductor, application, listing } = useContext(AppSubmissionContext)
  const [validateHousehold, setValidateHousehold] = useState(true)
  const currentPageSection = 2

  conductor.stepTo("Live Alone")

  /* Form Handler */
  const { handleSubmit, register, errors, clearErrors } = useForm()
  const onSubmit = () => {
    conductor.sync()
    conductor.routeToNextOrReturnUrl()
  }

  //  const backUrl =
  //    application.alternateContact.type == "noContact"
  //      ? "/applications/contact/alternate-contact-type"
  //      : "/applications/contact/alternate-contact-contact"

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

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">
            {t("application.household.liveAlone.title")}
          </h2>
        </div>

        <Form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <HouseholdSizeField
              listing={listing}
              householdSize={application.householdSize}
              validate={validateHousehold}
              register={register}
              error={errors.householdSize}
              clearErrors={clearErrors}
              assistanceUrl={t("application.household.assistanceUrl")}
            />
          </div>

          <div className="form-card__pager">
            <div className="form-card__pager-row">
              <Button
                big={true}
                className="w-full md:w-3/4"
                onClick={() => {
                  application.householdSize = 1
                  application.householdMembers = []
                  setValidateHousehold(true)
                }}
              >
                {t("application.household.liveAlone.willLiveAlone")}
              </Button>
            </div>
            <div className="form-card__pager-row">
              <Button
                big={true}
                className="w-full md:w-3/4"
                onClick={() => {
                  if (application.householdSize == 1) application.householdSize = 0
                  setValidateHousehold(false)
                }}
              >
                {t("application.household.liveAlone.liveWithOtherPeople")}
              </Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}
