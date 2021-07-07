/*
2.6.c Reserved Unit Conditionals
Unlike Reserved Community Buildings which are 100% reserved, in the event that there a mix of reserved and non reserved units ask a question after collecting household information.
*/
import React, { useContext } from "react"
import {
  AppearanceStyleType,
  Button,
  FormCard,
  ProgressNav,
  t,
  Form,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import FormBackLink from "../../../src/forms/applications/FormBackLink"

const ApplicationUnits = () => {
  const { conductor, application } = useContext(AppSubmissionContext)
  const currentPageSection = 2

  /* Form Handler */
  const { handleSubmit } = useForm()
  const onSubmit = () => {
    conductor.completeSection(2)
    conductor.sync()
    conductor.routeToNextOrReturnUrl()
  }

  return (
    <FormsLayout>
      <FormCard>
        <h5 className="font-alt-sans text-center mb-5">LISTING</h5>

        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
        />
      </FormCard>

      <FormCard>
        <FormBackLink
          url={conductor.determinePreviousUrl()}
          onClick={() => conductor.setNavigatedBack(true)}
        />

        <h2 className="form-card__title is-borderless">Reserved Unit Conditionals</h2>

        <hr />

        <Form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          (FORM)
          <div className="text-center mt-6">
            <Button styleType={AppearanceStyleType.primary}>Next</Button>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default ApplicationUnits
