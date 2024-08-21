import React, { useEffect, useState, useContext } from "react"
import { useRouter } from "next/router"
import { t } from "@bloom-housing/ui-components"
import { AuthContext, BloomCard, CustomIconMap, RequireLogin } from "@bloom-housing/shared-helpers"
import { Application, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Card, Button, Heading, Icon, Message } from "@bloom-housing/ui-seeds"
import FormsLayout from "../../../../layouts/forms"
import {
  ApplicationError,
  ApplicationListingCard,
} from "../../../../components/account/ApplicationCards"
import styles from "../../../../../styles/lottery-results.module.scss"

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

  const preferenceRank = (rank: number, preferenceName: string, numApplicants: number) => {
    return (
      <Card.Section divider={"flush"} className={styles["preference-rank"]}>
        <div className={styles["rank-number"]}>{`#${rank}`}</div>
        <div>
          <Heading priority={4} size={"lg"}>
            {preferenceName}
          </Heading>
          <p className={styles["number-applicants"]}>
            {t("account.application.lottery.applicantList", { applicants: numApplicants })}
          </p>
        </div>
      </Card.Section>
    )
  }

  return (
    <>
      <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
        <FormsLayout className={styles["lottery-results"]}>
          {noApplication && (
            <ApplicationError error={t("account.application.noApplicationError")} />
          )}
          {unauthorized && <ApplicationError error={t("account.application.noAccessError")} />}
          {application && (
            <>
              <ApplicationListingCard listingName={listing?.name} listingId={listing?.id} />
              <BloomCard className={"mb-6"}>
                <>
                  <Card.Section divider={"inset"} className={"border-none"}>
                    <Button
                      size="sm"
                      leadIcon={<Icon>{CustomIconMap.chevronLeft}</Icon>}
                      variant={"text"}
                      href={"/account/applications"}
                    >
                      {t("t.back")}
                    </Button>
                    <Heading priority={2} size={"2xl"} className="mt-6">
                      {t("account.application.lottery.resultsHeader")}
                    </Heading>
                    <p className="mt-4">
                      {t("account.application.lottery.resultsSubheader", {
                        applications: 2500,
                        units: 50,
                      })}
                      {/* TODO: Plug in BE data */}
                    </p>
                  </Card.Section>
                  <Card.Section
                    divider={"flush"}
                    className={`${styles["background-card-section"]} border-none`}
                  >
                    <Heading priority={3} size={"xl"}>
                      {t("account.application.lottery.rawRankHeader")}
                    </Heading>
                    <p className={styles["raw-rank"]}>57</p> {/* TODO: Plug in BE data */}
                  </Card.Section>
                  <Card.Section divider={"flush"}>
                    <div>
                      <p>{t("account.application.lottery.rawRank")}</p>
                    </div>
                    <div>
                      <Button
                        className={styles["section-button"]}
                        href={"https://www.exygy.com"} // NOTE: Update per jurisdiction
                        hideExternalLinkIcon={true}
                        size={"sm"}
                      >
                        {t("account.application.lottery.rawRankButton")}
                      </Button>
                    </div>
                  </Card.Section>
                  <Card.Section divider={"flush"} className={"border-none"}>
                    <div>
                      <Heading priority={3} size={"xl"} className={`${styles["section-heading"]}`}>
                        {t("account.application.lottery.preferencesHeader")}
                      </Heading>
                      <p>{t("account.application.lottery.preferences")}</p>
                    </div>
                    <div>
                      <Button
                        className={styles["section-button"]}
                        href={"https://www.exygy.com"} // NOTE: Update per jurisdiction
                        hideExternalLinkIcon={true}
                        size={"sm"}
                      >
                        {t("account.application.lottery.preferencesButton")}
                      </Button>
                    </div>
                  </Card.Section>
                  <Card.Section
                    divider={"flush"}
                    className={`${styles["background-card-alert-section"]}`}
                  >
                    <Message fullwidth={true} className={styles["preference-alert"]}>
                      {t("account.application.lottery.preferencesMessage")}
                    </Message>
                  </Card.Section>
                  {/* TODO: Plug in BE data */}
                  {preferenceRank(10, `Certificate of Preference`, 10)}
                  {preferenceRank(15, `Displaced Tenants Housing Preference`, 15)}
                  {preferenceRank(1008, `Live/Work Preference`, 2800)}
                  <Card.Section divider={"flush"} className={"border-none"}>
                    <div>
                      <Heading priority={3} size={"xl"} className={`${styles["section-heading"]}`}>
                        {t("account.application.lottery.nextHeader")}
                      </Heading>
                      <p>{t("account.application.lottery.next")}</p>
                    </div>
                  </Card.Section>
                </>
              </BloomCard>
            </>
          )}
        </FormsLayout>
      </RequireLogin>
    </>
  )
}
