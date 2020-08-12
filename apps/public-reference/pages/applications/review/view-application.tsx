/*
5.4 View application
*/
import Link from "next/link"
import moment from "moment"
import { FormCard, t } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import { useContext, useMemo } from "react"
import FormSummaryDetails from "../../../src/forms/applications/FormSummaryDetails"
import { DATE_FORMAT } from "../../../lib/constants"

export default () => {
  const { conductor, application, listing } = useContext(AppSubmissionContext)
  const currentPageStep = 6

  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data) => {
    console.log(data)

    //Router.push("/applications/review/confirmation").then(() => window.scrollTo(0, 0))
  }

  const confirmationDate = useMemo(() => {
    return moment().format(DATE_FORMAT)
  }, [])

  return (
    <FormsLayout>
      <FormCard header="Confirmation">
        <div className="p-4">
          <Link href="/applications/review/summary">
            <a className="lined">{t("application.confirmation.viewOriginalListing")}</a>
          </Link>
        </div>
      </FormCard>

      <FormCard>
        <div className="form-card__group mx-0">
          <h2 className="form-card__title is-borderless">
            {t("application.confirmation.informationSubmittedTitle")}
          </h2>

          <div className="flex flex-col justify-center text-center mt-3">
            <span className="text-sm font-normal">
              {t("application.confirmation.submitted")}
              {confirmationDate}
            </span>

            <hr className="my-6" />

            <h3 className="font-alt-sans uppercase text-sm text-black font-semibold">
              {t("application.confirmation.lotteryNumber")}
            </h3>

            {/* TODO: replace with the number from backend */}
            <span className="text-black text-3xl text-serif-lg font-normal my-0">#00545847</span>
          </div>
        </div>

        <FormSummaryDetails application={application} editMode={false} />

        <h3 className="form--card__sub-header">{t("application.confirmation.preferences")}</h3>

        <div className="form-card__group border-b mx-0">
          {/* TODO: probably status should depends on backend result (?) */}
          <p className="text-base font-semibold">{t("application.confirmation.generalLottery")}</p>

          <div className="text-center mt-10">
            <a href="#" className="lined" onClick={() => window.print()}>
              {t("application.confirmation.printCopy")}
            </a>
          </div>
        </div>
      </FormCard>
    </FormsLayout>
  )
}
