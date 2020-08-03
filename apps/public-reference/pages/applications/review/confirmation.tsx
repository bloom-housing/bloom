/*
5.4 Confirmation
Application confirmation with lottery number (confirmation number) 
*/
import Link from "next/link"
import Router from "next/router"
import { Button, FormCard, ProgressNav } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import { useContext, useMemo } from "react"

export default () => {
  const context = useContext(AppSubmissionContext)
  const { application, listing } = context
  const conductor = useMemo(() => new ApplicationConductor(application, listing, context), [
    application,
    listing,
    context,
  ])
  const currentPageStep = 6

  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data) => {
    console.log(data)

    //Router.push("/applications/review/confirmation").then(() => window.scrollTo(0, 0))
  }

  return (
    <FormsLayout>
      <FormCard>
        <h5 className="font-alt-sans text-center mb-5">LISTING</h5>

        <ProgressNav
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          labels={["You", "Household", "Income", "Preferences", "Review"]}
        />
      </FormCard>

      <FormCard>
        <h2 className="form-card__title is-borderless">Confirmation</h2>

        <hr />

        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          <div className="text-center mt-6">
            <Button
              filled={true}
              onClick={() => {
                Router.push("/create-account").then(() => window.scrollTo(0, 0))
              }}
            >
              Create Account
            </Button>
          </div>
        </form>
      </FormCard>
    </FormsLayout>
  )
}
