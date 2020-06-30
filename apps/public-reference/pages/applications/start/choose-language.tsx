/*
0.1 - Choose Language
Applicants are given the option to start the Application in one of a number of languages via button group. Once inside the application the applicant can use the language selection at the top of the page.
https://github.com/bloom-housing/bloom/issues/277
*/
import axios from "axios"
import Router from "next/router"
import {
  Button,
  ImageCard,
  LinkButton,
  FormCard,
  ProgressNav,
  t,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import { useContext, useEffect, useState } from "react"

const loadListing = async (stateFunction) => {
  const response = await axios.get(process.env.listingServiceUrl)
  stateFunction(response.data.listings[2])
}

export default () => {
  const [listing, setListing] = useState(null)

  useEffect(() => {
    loadListing(setListing)
  })

  const context = useContext(AppSubmissionContext)
  const { application } = context
  const conductor = new ApplicationConductor(application, context)
  conductor.reset(false)
  const currentPageStep = 1

  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data) => {
    console.log(data)

    Router.push("/applications/contact/name").then(() => window.scrollTo(0, 0))
  }

  return (
    <FormsLayout>
      <FormCard header="LISTING">
        <ProgressNav
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          totalNumberOfSteps={conductor.totalNumberOfSteps()}
          labels={["You", "Household", "Income", "Preferences", "Review"]}
        />
      </FormCard>

      <FormCard>
        <div className="form-card__lead">
          <h2 className="form-card__title is-borderless">Let’s get started on your application</h2>

          {listing && (
            <div className="mt-5">
              <ImageCard
                title={listing.name}
                imageUrl={listing.imageUrl || ""}
                href={`listing/id=${listing.id}`}
                as={`/listing/${listing.id}`}
                listing={listing}
              />
            </div>
          )}
        </div>

        <div className="form-card__pager">
          <form className="" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-card__pager-row primary px-4">
              <h3 className="my-4 font-alt-sans field-label--caps text-base text-black">
                Choose Your Language
              </h3>

              <Button
                big={true}
                className="mx-1"
                onClick={() => {
                  // Set the language in the context here...
                }}
              >
                Begin
              </Button>

              <Button
                big={true}
                className="mx-1"
                onClick={() => {
                  //
                }}
              >
                Empezar
              </Button>

              <Button
                big={true}
                className="mx-1"
                onClick={() => {
                  //
                }}
              >
                開始
              </Button>
            </div>
          </form>

          <div className="form-card__pager-row primary px-4">
            <h2 className="border-t border-gray-450 form-card__title pt-10 w-full">
              Already have an account?
            </h2>

            <p className="my-6">
              Signing in could save you time by starting with details of your last application, and
              allow you to check the status of this application at any time.
            </p>

            <div>
              <LinkButton href="/sign-in" big={true}>
                Sign In
              </LinkButton>
            </div>
          </div>
        </div>
      </FormCard>
    </FormsLayout>
  )
}
