/*
1.2 - Name
Primary applicant details. Name, DOB and Email Address
*/
import Router from "next/router"
import { Button, Field, FormCard, ProgressNav } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import PageContent from "./name.mdx"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import ContactNameStep from "../../../src/forms/applications/archived/step1"
import { useContext } from "react"

export default () => {
  const context = useContext(AppSubmissionContext)
  const { application } = context
  const conductor = new ApplicationConductor(application, context)
  const currentPageStep = 1

  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data) => {
    console.log(data)

    new ContactNameStep(conductor).save(data)

    Router.push("/applications/contact/address").then(() => window.scrollTo(0, 0))
  }

  return (
    <FormsLayout>
      <FormCard>
        <h5 className="font-alt-sans text-center mb-5">LISTING</h5>

        <ProgressNav
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          totalNumberOfSteps={conductor.totalNumberOfSteps()}
          labels={["You", "Household", "Income", "Preferences", "Review"]}
        />
      </FormCard>

      <FormCard>
        <h2 className="form-card__title is-borderless">Name</h2>

        <div className="markdown mt-6">
          <PageContent />
        </div>

        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex">
            <Field
              name="firstname"
              label="First Name"
              defaultValue={context.application.name?.split(" ")[0]}
              validation={{ required: true }}
              error={errors.firstname}
              errorMessage="Please enter a First Name"
              register={register}
            />

            <Field
              name="lastname"
              label="Last Name"
              defaultValue={context.application.name?.split(" ")[1]}
              validation={{ required: true }}
              error={errors.lastname}
              errorMessage="Please enter a Last Name"
              register={register}
            />
          </div>

          <div className="text-center mt-6">
            <Button
              filled={true}
              onClick={() => {
                //
              }}
            >
              Next
            </Button>
          </div>
        </form>
      </FormCard>
    </FormsLayout>
  )
}
