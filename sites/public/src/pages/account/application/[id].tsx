import React, { useEffect, useState, useContext } from "react"
import { t, FormCard, dateToString, Heading } from "@bloom-housing/ui-components"
import Link from "next/link"
import FormSummaryDetails from "../../../components/shared/FormSummaryDetails"
import FormsLayout from "../../../layouts/forms"
import { Application } from "@bloom-housing/backend-core/types"
import { useRouter } from "next/router"
import { AuthContext, RequireLogin } from "@bloom-housing/shared-helpers"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

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
        .retrieve({ id: applicationId })
        .then((app) => {
          setApplication(app)
          listingsService
            ?.retrieve({ id: app.listing.id })
            .then((retrievedListing) => {
              // TODO: fix this once this page is migrated
              setListing(retrievedListing as unknown as Listing)
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
            <FormCard header={<Heading priority={1}>{t("account.application.error")}</Heading>}>
              <p className="field-note mb-5">{t("account.application.noApplicationError")}</p>
              <a href={`applications`} className="button is-small">
                {t("account.application.return")}
              </a>
            </FormCard>
          )}
          {unauthorized && (
            <FormCard header={<Heading priority={1}>{t("account.application.error")}</Heading>}>
              <p className="field-note mb-5">{t("account.application.noAccessError")}</p>
              <a href={`applications`} className="button is-small">
                {t("account.application.return")}
              </a>
            </FormCard>
          )}
          {application && (
            <>
              <FormCard
                header={<Heading priority={1}>{t("account.application.confirmation")}</Heading>}
              >
                <div className="py-2">
                  {listing && (
                    <span className="lined text-sm">
                      <Link
                        href={`listing/id=${listing.id}`}
                        as={`${origin}/listing/${listing.id}/${listing.urlSlug}`}
                      >
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
                    {dateToString(application.submissionDate)}
                  </p>
                </div>
                <div className="form-card__group text-center">
                  <h3 className="form-card__paragraph-title">
                    {t("application.confirmation.lotteryNumber")}
                  </h3>

                  <p className="font-serif text-2xl my-0">
                    {application.confirmationCode || application.id}
                  </p>
                </div>

                <FormSummaryDetails listing={listing} application={application} />

                <div className="form-card__pager hide-for-print">
                  <div className="form-card__pager-row py-6">
                    <button className="lined text-sm" onClick={() => window.print()}>
                      {t("application.confirmation.printCopy")}
                    </button>
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
