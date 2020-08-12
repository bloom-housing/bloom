/*
5.4 Confirmation
Application confirmation with lottery number (confirmation number) 
*/
import Link from "next/link"
import Router from "next/router"
import { Button, FormCard, ProgressNav, t } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import { useContext, useMemo } from "react"

export default () => {
  const { conductor, application, listing } = useContext(AppSubmissionContext)
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
        <div className="form-card__lead">
          <h2 className="form-card__title is-borderless">
            {t("application.review.confirmation.title")}
            {listing?.name}
          </h2>
        </div>

        {listing?.imageUrl && (
          <div className="form-card__image">
            <img src={listing.imageUrl} alt={listing?.name} />
          </div>
        )}

        <div className="form-card__group text-center">
          <h3 className="">{t("application.review.confirmation.lotteryNumber")}</h3>
          #00545847
          <p className="field-note mt-2">
            {t("application.review.confirmation.pleaseWriteNumber")}
          </p>
        </div>

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
