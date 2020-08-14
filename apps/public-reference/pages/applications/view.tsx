/*
5.5 View
Optional application summary
*/
import Link from "next/link"
import moment from "moment"
import { FormCard, t } from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { AppSubmissionContext } from "../../lib/AppSubmissionContext"
import { useContext, useMemo } from "react"
import FormSummaryDetails from "../../src/forms/applications/FormSummaryDetails"
import { DATE_FORMAT } from "../../lib/constants"

export default () => {
  const { application } = useContext(AppSubmissionContext)

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

        <div className="text-center form-card__group border-b mx-0">
          <a href="#" className="lined" onClick={() => window.print()}>
            {t("application.confirmation.printCopy")}
          </a>
        </div>
      </FormCard>
    </FormsLayout>
  )
}
