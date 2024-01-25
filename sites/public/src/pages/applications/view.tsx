/*
5.5 View
Optional application summary
*/
import React, { useContext, useEffect, useMemo } from "react"
import Link from "next/link"
import dayjs from "dayjs"
import { t } from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { AppSubmissionContext } from "../../lib/applications/AppSubmissionContext"
import FormSummaryDetails from "../../components/shared/FormSummaryDetails"
import { DATE_FORMAT, UserStatus } from "../../lib/constants"
import {
  pushGtmEvent,
  PageView,
  AuthContext,
  listingSectionQuestions,
} from "@bloom-housing/shared-helpers"
import { ApplicationSection } from "@bloom-housing/backend-core"
import { Card, Heading } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"

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
      <Card spacing={"sm"} className={"my-6"}>
        <CardSection className={"bg-primary px-8 py-4 text-white"}>
          <Heading priority={1} className={"text-xl font-bold font-alt-sans"}>
            {t("account.application.confirmation")}
          </Heading>
        </CardSection>
        <CardSection className={"px-8"}>
          <div>
            {listing && (
              <span className={"lined text-sm"}>
                <Link href={`/listing/${listing.id}/${listing.urlSlug}`}>
                  {t("application.confirmation.viewOriginalListing")}
                </Link>
              </span>
            )}
          </div>
        </CardSection>
      </Card>
      <Card spacing={"lg"} className={"mb-6"}>
        <CardSection divider={"inset"}>
          <Heading priority={2} size={"2xl"}>
            {t("application.confirmation.informationSubmittedTitle")}
          </Heading>
          <p className="field-note mt-4">
            {t("application.confirmation.submitted")}
            {confirmationDate}
          </p>
        </CardSection>
        <CardSection divider={"inset"} className={"border-none"}>
          <Heading priority={3} size={"md"}>
            {t("application.confirmation.lotteryNumber")}
          </Heading>
          <p className="font-serif text-2xl my-0">
            {application.confirmationCode || application.id}
          </p>
        </CardSection>
        <FormSummaryDetails
          listing={listing}
          application={application}
          hidePreferences={
            listingSectionQuestions(listing, ApplicationSection.preferences)?.length === 0
          }
          hidePrograms={listingSectionQuestions(listing, ApplicationSection.programs)?.length === 0}
          editMode={false}
        />
        <CardSection>
          <div className="hide-for-print">
            <button className="lined text-sm" onClick={() => window.print()}>
              {t("application.confirmation.printCopy")}
            </button>
          </div>
        </CardSection>
      </Card>
    </FormsLayout>
  )
}

export default ApplicationView
