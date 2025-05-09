import React, { useEffect, useState, useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { useRouter } from "next/router"
import { AuthContext, RequireLogin } from "@bloom-housing/shared-helpers"
import { LoadingState } from "@bloom-housing/ui-seeds"
import {
  Application,
  Listing,
  ListingViews,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { SubmittedApplicationView } from "../../../../components/applications/SubmittedApplicationView"
import { ApplicationError } from "../../../../components/account/ApplicationCards"
import FormsLayout from "../../../../layouts/forms"

export default () => {
  const router = useRouter()
  const applicationId = router.query.id as string
  const { applicationsService, listingsService, profile } = useContext(AuthContext)
  const [application, setApplication] = useState<Application>()
  const [listing, setListing] = useState<Listing>()
  const [unauthorized, setUnauthorized] = useState(false)
  const [noApplication, setNoApplication] = useState(false)
  const [loading, setLoading] = useState(null)

  useEffect(() => {
    if (profile && !application && loading === null) {
      setLoading(true)
      applicationsService
        .retrieve({ applicationId })
        .then((app) => {
          setApplication(app)
          listingsService
            ?.retrieve({ id: app.listings.id, view: ListingViews.base })
            .then((retrievedListing) => {
              setListing(retrievedListing)
              setLoading(false)
            })
            .catch((err) => {
              setLoading(false)
              console.error(`Error fetching listing: ${err}`)
            })
        })
        .catch((err) => {
          setLoading(false)
          console.error(`Error fetching application: ${err}`)
          const { status } = err.response || {}
          if (status === 404) {
            setNoApplication(true)
          }
          if (status === 403) {
            setUnauthorized(true)
          }
        })
    }
  }, [profile, applicationId, applicationsService, listingsService])

  return (
    <>
      <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
        <FormsLayout>
          <LoadingState loading={loading || loading === null}>
            {noApplication && (
              <ApplicationError error={t("account.application.noApplicationError")} />
            )}
            {unauthorized && <ApplicationError error={t("account.application.noAccessError")} />}
            {application && (
              <SubmittedApplicationView
                application={application}
                listing={listing}
                backHref={"/account/applications"}
              />
            )}
          </LoadingState>
        </FormsLayout>
      </RequireLogin>
    </>
  )
}
