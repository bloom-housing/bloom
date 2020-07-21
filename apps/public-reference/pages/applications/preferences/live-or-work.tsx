/*
4.2.4 Live or Work Housing Preference
Preference offered based on addresses and answer to work address question provided on the application
*/
import Link from "next/link"
import Router from "next/router"
import { Button, FormCard, ProgressNav } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import { useContext } from "react"

export default () => {
  const context = useContext(AppSubmissionContext)
  const { application, listing } = context
  const conductor = new ApplicationConductor(application, listing, context)
  const currentPageStep = 4

  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data) => {
    console.log(data)

    Router.push("/applications/preferences/general").then(() => window.scrollTo(0, 0))
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
        <p className="text-bold">
          <strong>
            <Link href="/applications/preferences/intro">Back</Link>
          </strong>
        </p>

        <h2 className="form-card__title is-borderless">Live or Work Housing Preference</h2>

        <hr />

        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          (FORM)
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
