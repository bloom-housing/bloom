/*
2.6.c Reserved Unit Conditionals
Unlike Reserved Community Buildings which are 100% reserved, in the event that there a mix of reserved and non reserved units ask a question after collecting household information.
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
  const currentPageStep = 2

  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data) => {
    console.log(data)

    application.completedStep = 2
    conductor.sync()

    Router.push("/applications/financial/vouchers").then(() => window.scrollTo(0, 0))
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
            <Link href="/applications/household/ada">Back</Link>
          </strong>
        </p>

        <h2 className="form-card__title is-borderless">Reserved Unit Conditionals</h2>

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
