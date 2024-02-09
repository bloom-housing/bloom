import React, { useEffect, useState, useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useRouter } from "next/router"
import { AuthContext, RequireLogin } from "@bloom-housing/shared-helpers"
import { Application, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { SubmittedApplicationView } from "../../../components/applications/SubmittedApplicationView"
import { Card, Button, Heading } from "@bloom-housing/ui-seeds"

export default () => {
  const router = useRouter()
  const applicationId = router.query.id as string
  const { applicationsService, listingsService, profile } = useContext(AuthContext)
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
            ?.retrieve({ id: app.listings.id })
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
            <Card spacing={"sm"} className={"my-6"}>
              <Card.Section className={"bg-primary px-8 py-4"}>
                <Heading priority={1} className={"text-xl font-bold font-alt-sans text-white"}>
                  {t("account.application.error")}
                </Heading>
              </Card.Section>
              <Card.Section className={"px-8"}>
                <p className="field-note mb-5">{t("account.application.noApplicationError")}</p>
                <Button href={`applications`} size="sm" variant="primary-outlined">
                  {t("account.application.return")}
                </Button>
              </Card.Section>
            </Card>
          )}
          {unauthorized && (
            <Card spacing={"sm"} className={"my-6"}>
              <Card.Section className={"bg-primary px-8 py-4"}>
                <Heading priority={1} className={"text-xl font-bold font-alt-sans text-white"}>
                  {t("account.application.error")}
                </Heading>
              </Card.Section>
              <Card.Section className={"px-8"}>
                <p className="field-note mb-5">{t("account.application.noAccessError")}</p>
                <Button href={`applications`} size="sm" variant="primary-outlined">
                  {t("account.application.return")}
                </Button>
              </Card.Section>
            </Card>
          )}
          {application && (
            <SubmittedApplicationView
              application={application}
              listing={listing}
              backHref={"/account/applications"}
            />
          )}
        </FormsLayout>
      </RequireLogin>
    </>
  )
}
