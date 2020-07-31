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
      <p className="form-card__back">
        <strong>
          <Link href="/applications/review/summary">{t("t.back")}</Link>
        </strong>
      </p>

      <FormCard header="Confirmation">
        <div className="p-4">
          <Link href="/applications/review/summary">
            {t("application.confirmation.viewOriginalListing")}
          </Link>
        </div>
      </FormCard>

      <FormCard>
        <h2 className="form-card__title is-borderless mt-4">
          {t("application.confirmation.informationSubmittedTitle")}
        </h2>

        <div className="flex justify-center field-note p-2">
          <p>
            {t("application.confirmation.submitted")}
            May 14, 2020
          </p>

          <hr />

          <h3 className="uppercase">{t("application.confirmation.lotteryNumber")}</h3>
          <span>#00545847</span>
        </div>
      </FormCard>
    </FormsLayout>
  )
}
