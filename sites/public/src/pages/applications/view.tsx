/*
5.5 View
Optional application summary
*/
import Link from "next/link"
import dayjs from "dayjs"
import { FormCard, t } from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import { useContext, useEffect, useMemo } from "react"
import FormSummaryDetails from "../../components/forms/applications/FormSummaryDetails"
import { DATE_FORMAT, UserStatus } from "../../../lib/constants"
import {
  pushGtmEvent,
  PageView,
  AuthContext,
  listingSectionQuestions,
} from "@bloom-housing/shared-helpers"
import { ApplicationSection } from "@bloom-housing/backend-core"

const ApplicationView = () => {
  const { application, listing } = useContext(AppSubmissionContext)
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Optional Summary",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const confirmationDate = useMemo(() => {
    return dayjs().format(DATE_FORMAT)
  }, [])

  return (
    <FormsLayout>
      <FormCard
        header={{
          isVisible: true,
          title: t("account.application.confirmation"),
        }}
      >
        <div className="py-2">
          {listing && (
            <span className={"lined text-tiny"}>
              <Link href={`/listing/${listing.id}/${listing.urlSlug}`}>
                {t("application.confirmation.viewOriginalListing")}
              </Link>
            </span>
          )}
        </div>
      </FormCard>

      <FormCard>
        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">
            {t("application.confirmation.informationSubmittedTitle")}
          </h2>
          <p className="field-note mt-4 text-center">
            {t("application.confirmation.submitted")}
            {confirmationDate}
          </p>
        </div>
        <div className="form-card__group text-center">
          <h3 className="form-card__paragraph-title">
            {t("application.confirmation.lotteryNumber")}
          </h3>

          <p className="font-serif text-3xl my-0">
            {application.confirmationCode || application.id}
          </p>
        </div>

        <FormSummaryDetails
          listing={listing}
          application={application}
          hidePreferences={
            listingSectionQuestions(listing, ApplicationSection.preferences)?.length === 0
          }
          hidePrograms={listingSectionQuestions(listing, ApplicationSection.programs)?.length === 0}
          editMode={false}
        />

        <div className="form-card__pager hide-for-print">
          <div className="form-card__pager-row py-6">
            <button className="lined text-tiny" onClick={() => window.print()}>
              {t("application.confirmation.printCopy")}
            </button>
          </div>
        </div>
      </FormCard>
    </FormsLayout>
  )
}

export default ApplicationView
