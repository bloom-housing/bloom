/*
5.5 View
Optional application summary
*/
import { t } from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { AppSubmissionContext } from "../../lib/applications/AppSubmissionContext"
import React, { useContext, useEffect, useState } from "react"
import { pushGtmEvent, PageView, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import { SubmittedApplicationView } from "../../components/applications/SubmittedApplicationView"
import { Jurisdiction } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const ApplicationView = () => {
  const { application, listing } = useContext(AppSubmissionContext)
  const { jurisdictionsService, profile } = useContext(AuthContext)
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>()

  // We have to load the jurisdiction manually in order to check for feature flags, in case a user isn't
  // logged in and thus doesn't have a profile
  useEffect(() => {
    jurisdictionsService
      .retrieve({ jurisdictionId: listing.jurisdictions.id })
      .then((res) => setJurisdiction(res))
  }, [listing, jurisdictionsService])

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Optional Summary",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout pageTitle={`${t("application.viewApplication")} - ${listing?.name}`}>
      <SubmittedApplicationView
        application={application}
        listing={listing}
        backHref={"/applications/review/confirmation"}
        jurisdiction={jurisdiction}
      ></SubmittedApplicationView>
    </FormsLayout>
  )
}

export default ApplicationView
