import React, { useEffect, useState, useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { useRouter } from "next/router"
import { AuthContext, RequireLogin } from "@bloom-housing/shared-helpers"
import { LoadingState } from "@bloom-housing/ui-seeds"
import {
  Application,
  Jurisdiction,
  Listing,
  ListingViews,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { SubmittedApplicationView } from "../../../../components/applications/SubmittedApplicationView"
import { ApplicationError } from "../../../../components/account/ApplicationCards"
import FormsLayout from "../../../../layouts/forms"

const AccountApplication = () => {
  const router = useRouter()
  const applicationId = router.query.id as string
  const { applicationsService, listingsService, jurisdictionsService, profile } =
    useContext(AuthContext)
  const [application, setApplication] = useState<Application>()
  const [listing, setListing] = useState<Listing>()
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>()
  const [unauthorized, setUnauthorized] = useState(false)
  const [noApplication, setNoApplication] = useState(false)
  const [listingUnavailable, setListingUnavailable] = useState(false)
  const [loading, setLoading] = useState(null)

  useEffect(() => {
    if (profile && !application && loading === null && !!applicationId) {
      const fetchApplicationData = async () => {
        setLoading(true)

        try {
          const app = await applicationsService.retrieve({ applicationId })
          setApplication(app)

          try {
            const retrievedListing = await listingsService?.retrieve({
              id: app.listings.id,
              view: ListingViews.full,
            })

            if (!retrievedListing) {
              setListingUnavailable(true)
              return
            }

            setListing(retrievedListing)

            if (retrievedListing?.jurisdictions?.id) {
              try {
                const retrievedJurisdiction = await jurisdictionsService?.retrieve({
                  jurisdictionId: retrievedListing.jurisdictions.id,
                })
                setJurisdiction(retrievedJurisdiction)
              } catch (err) {
                console.error(`Error fetching jurisdiction: ${err}`)
              }
            }
          } catch (err) {
            console.error(`Error fetching listing: ${err}`)
            setListingUnavailable(true)
          }
        } catch (err) {
          console.error(`Error fetching application: ${err}`)
          const { status } = err.response || {}
          if (status === 404) {
            setNoApplication(true)
          }
          if (status === 403) {
            setUnauthorized(true)
          }
        } finally {
          setLoading(false)
        }
      }

      void fetchApplicationData()
    }
  }, [
    profile,
    application,
    loading,
    applicationId,
    applicationsService,
    listingsService,
    jurisdictionsService,
  ])

  return (
    <>
      <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
        <FormsLayout
          pageTitle={`${t("application.viewApplication")} - ${listing?.name}`}
          metaDescription={t("pageDescription.viewApplication")}
        >
          <LoadingState loading={loading || loading === null}>
            {(noApplication || listingUnavailable) && (
              <ApplicationError error={t("account.application.noApplicationError")} />
            )}
            {unauthorized && <ApplicationError error={t("account.application.noAccessError")} />}
            {application && listing && (
              <SubmittedApplicationView
                application={application}
                listing={listing}
                backHref={"/account/applications"}
                jurisdiction={jurisdiction}
              />
            )}
          </LoadingState>
        </FormsLayout>
      </RequireLogin>
    </>
  )
}

export default AccountApplication
