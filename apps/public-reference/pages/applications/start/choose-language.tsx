/*
0.1 - Choose Language
Applicants are given the option to start the Application in one of a number of languages via button group. Once inside the application the applicant can use the language selection at the top of the page.
*/
import Router from "next/router"
import { Button, ProgressNav } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import PageContent from "./choose-language.mdx"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import Step1 from "../../../src/forms/applications/step1"
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

    const submission = new Step1(conductor)
    submission.save(data)

    Router.push("/applications/contact/name").then(() => window.scrollTo(0, 0))
  }

  const cardClasses = ["p-10", "bg-white", "mb-10", "border", "border-gray-450", "rounded-lg"].join(
    " "
  )

  return (
    <FormsLayout>
      <article className={cardClasses}>
        <h5 className="font-alt-sans text-center mb-5">LISTING</h5>

        <ProgressNav
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          totalNumberOfSteps={conductor.totalNumberOfSteps()}
          labels={["You", "Household", "Income", "Preferences", "Review"]}
        />
      </article>

      <article className={cardClasses}>
        <div className="markdown">
          <PageContent />
        </div>

        <form id="applications-new" className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          (BUTTONS)
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
      </article>
    </FormsLayout>
  )
}
