import React, { useEffect, useState, useContext } from "react"
import { AuthContext, RequireLogin, t, FormCard, dateToString } from "@bloom-housing/ui-components"
import Link from "next/link"
import FormSummaryDetails from "../../../src/forms/applications/FormSummaryDetails"
import FormsLayout from "../../../layouts/forms"
import { Application, Listing } from "@bloom-housing/backend-core/types"
import { useRouter } from "next/router"

export default () => {
  const router = useRouter()
  const applicationId = router.query.id as string
  const { applicationsService, listingsService } = useContext(AuthContext)
  const { profile } = useContext(AuthContext)
  const [application, setApplication] = useState<Application>()
  const [listing, setListing] = useState<Listing>()
  const [unauthorized, setUnauthorized] = useState(false)
  const [noApplication, setNoApplication] = useState(false)
  useEffect(() => {
    if (profile) {
      applicationsService
        .retrieve({ applicationId })
        .then((app) => {
          setApplication(app)
          listingsService
            ?.retrieve({ listingId: app.listing.id })
            .then((retrievedListing) => {
              setListing(retrievedListing)
            })
            .catch((err) => {
              console.error(`Error fetching listing: ${err}`)
            })
        })
        .catch((err) => {
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
          {noApplication && (
            <FormCard header={t("account.application.error")}>
              <p className="field-note mb-5">{t("account.application.noApplicationError")}</p>
              <a href={`applications`} className="button is-small">
                {t("account.application.return")}
              </a>
            </FormCard>
          )}
          {unauthorized && (
            <FormCard header={t("account.application.error")}>
              <p className="field-note mb-5">{t("account.application.noAccessError")}</p>
              <a href={`applications`} className="button is-small">
                {t("account.application.return")}
              </a>
            </FormCard>
          )}
          {application && (
            <>
              <FormCard header={t("account.application.confirmation")}>
                <div className="py-2">
                  {listing && (
                    <Link
                      href={`listing/id=${listing.id}`}
                      as={`${origin}/listing/${listing.id}/${listing.urlSlug}`}
                    >
                      <a className="lined text-tiny">
                        {t("application.confirmation.viewOriginalListing")}
                      </a>
                    </Link>
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
                    {dateToString(application.submissionDate)}
                  </p>
                </div>
                <div className="form-card__group text-center">
                  <h3 className="form-card__paragraph-title">
                    {t("application.confirmation.lotteryNumber")}
                  </h3>

                  <p className="font-serif text-3xl my-0">{application.confirmationCode}</p>
                </div>

                <FormSummaryDetails listing={listing} application={application} />

                <div className="form-card__pager hide-for-print">
                  <div className="form-card__pager-row py-6">
                    <a href="#" className="lined text-tiny" onClick={() => window.print()}>
                      {t("application.confirmation.printCopy")}
                    </a>
                  </div>
                </div>
              </FormCard>
            </>
          )}
        </FormsLayout>
      </RequireLogin>
    </>
  )
}
