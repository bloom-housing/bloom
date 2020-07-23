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

const loadListing = async (stateFunction, conductor, context) => {
  const response = await axios.get(process.env.listingServiceUrl)
  conductor.listing = response.data.listings[2]
  stateFunction(conductor.listing)
  context.syncListing(conductor.listing)
}

export default () => {
  const [listing, setListing] = useState(null)
  const context = useContext(AppSubmissionContext)
  const { application } = context
  const conductor = new ApplicationConductor(application, listing, context)
  useEffect(() => {
    loadListing(setListing, conductor, context)
  }, [])

  const currentPageStep = 1

  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data) => {
    console.log(data)
    conductor.sync()

    Router.push("/applications/start/what-to-expect").then(() => window.scrollTo(0, 0))
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
          <h2 className="form-card__title is-borderless">
            {t("application.chooseLanguage.letsGetStarted")}
          </h2>
        </div>

        {listing && (
          <div className="form-card__group p-0 m-0">
            <ImageCard title={listing.name} imageUrl={listing.imageUrl || ""} listing={listing} />
          </div>
        )}

        <div className="form-card__pager">
          <form className="" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-card__pager-row primary px-4">
              <h3 className="mb-4 font-alt-sans field-label--caps block text-base text-black">
                {t("application.chooseLanguage.chooseYourLanguage")}
              </h3>

              <Button
                className="mx-1"
                onClick={() => {
                  // Set the language in the context here...
                }}
              >
                Begin
              </Button>

              <Button
                className="mx-1"
                onClick={() => {
                  //
                }}
              >
                Empezar
              </Button>

              <Button
                className="mx-1"
                onClick={() => {
                  //
                }}
              >
                開始
              </Button>
            </div>
          </form>

          <div className="form-card__pager-row primary px-4 border-t border-gray-450">
            <h2 className="form-card__title w-full border-none pt-0 mt-0">
              {t("application.chooseLanguage.haveAnAccount")}
            </h2>

            <p className="my-6">{t("application.chooseLanguage.signInSaveTime")}</p>

            <div>
              <LinkButton href="/sign-in">{t("nav.signIn")}</LinkButton>
            </div>
          </div>
        </div>
      </FormCard>
    </FormsLayout>
  )
}
