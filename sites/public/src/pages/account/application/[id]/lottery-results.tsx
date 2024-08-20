import React, { useEffect, useState, useContext } from "react"
import { useRouter } from "next/router"
import { t } from "@bloom-housing/ui-components"
import { AuthContext, BloomCard, CustomIconMap, RequireLogin } from "@bloom-housing/shared-helpers"
import { Application, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Card, Button, Heading, Icon, Message } from "@bloom-housing/ui-seeds"
import FormsLayout from "../../../../layouts/forms"
import { ApplicationError } from "../../../../components/account/ApplicationError"
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
        <FormsLayout className={styles["lottery-results"]}>
          {noApplication && (
            <ApplicationError error={t("account.application.noApplicationError")} />
          )}
          {unauthorized && <ApplicationError error={t("account.application.noAccessError")} />}
          {application && (
            <>
              <Card spacing={"sm"} className={"my-6"}>
                <Card.Section className={"bg-primary px-8 py-4"}>
                  <Heading priority={1} size="xl" className={styles["card-header"]}>
                    {listing?.name}
                  </Heading>
                </Card.Section>
                <Card.Section className={"px-8"}>
                  <div>
                    {listing && (
                      <Button
                        size="sm"
                        variant={"text"}
                        href={`/listing/${listing.id}/${listing?.urlSlug}`}
                      >
                        {t("application.confirmation.viewOriginalListing")}
                      </Button>
                    )}
                  </div>
                </Card.Section>
              </Card>
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
                      {"Here are your lottery results"}
                    </Heading>
                    <p className="mt-4">
                      {"2500 applications were submitted for 50 available units"}
                    </p>
                  </Card.Section>
                  <Card.Section
                    divider={"flush"}
                    className={`${styles["background-card-section"]} border-none`}
                  >
                    <Heading priority={3} size={"xl"}>{`Your raw rank`}</Heading>
                    <p className={styles["raw-rank"]}>57</p>
                  </Card.Section>
                  <Card.Section divider={"flush"}>
                    <div>
                      <p>{`Raw rank is the basic randomized order of all applications received for the listing before  the preferences are applied. For example, if 1,000 applications are submitted, each will be assigned a raw rank of 1 to 1,000.`}</p>
                    </div>

                    <div>
                      <Button
                        className={styles["section-button"]}
                        href={"https://www.exygy.com"}
                        hideExternalLinkIcon={true}
                        size={"sm"}
                      >
                        What is raw rank?
                      </Button>
                    </div>
                  </Card.Section>
                  <Card.Section divider={"flush"} className={"border-none"}>
                    <div>
                      <Heading
                        priority={3}
                        size={"xl"}
                        className={`${styles["section-heading"]}`}
                      >{`Your lottery preference(s)`}</Heading>
                      <p>{`Lottery preferences for your application are shown here in priority order. If you do not qualify for any lottery preferences, you will be part of the general lottery category. The general lottery category is the last group processed.`}</p>
                    </div>

                    <div>
                      <Button
                        className={styles["section-button"]}
                        href={"https://www.exygy.com"}
                        hideExternalLinkIcon={true}
                        size={"sm"}
                      >
                        What are lottery preferences?
                      </Button>
                    </div>
                  </Card.Section>
                  <Card.Section
                    divider={"flush"}
                    className={`${styles["background-card-alert-section"]}`}
                  >
                    <Message fullwidth={true}>
                      These results are based on the information you provided in your application.
                      Preference eligibility is subject to change once your information is verified.
                    </Message>
                  </Card.Section>
                  <Card.Section divider={"flush"} className={styles["preference-rank"]}>
                    <div className={styles["rank-number"]}>#10</div>
                    <div>
                      <Heading priority={4} size={"lg"}>{`Certificate of Preference`}</Heading>
                      <p
                        className={styles["number-applicants"]}
                      >{`Out of 10 applicants on this list`}</p>
                    </div>
                  </Card.Section>
                  <Card.Section divider={"flush"} className={styles["preference-rank"]}>
                    <div className={styles["rank-number"]}>#15</div>
                    <div>
                      <Heading
                        priority={4}
                        size={"lg"}
                      >{`Displaced Tenants Housing Preference`}</Heading>
                      <p
                        className={styles["number-applicants"]}
                      >{`Out of 15 applicants on this list`}</p>
                    </div>
                  </Card.Section>
                  <Card.Section divider={"flush"} className={styles["preference-rank"]}>
                    <div className={styles["rank-number"]}>
                      <span className={styles["rank-number-content"]}>#1008</span>
                    </div>
                    <div>
                      <Heading priority={4} size={"lg"}>{`Live/Work Preference`}</Heading>
                      <p
                        className={styles["number-applicants"]}
                      >{`Out of 2800 applicants on this list`}</p>
                    </div>
                  </Card.Section>
                  <Card.Section divider={"flush"} className={"border-none"}>
                    <div>
                      <Heading
                        priority={3}
                        size={"xl"}
                        className={`${styles["section-heading"]}`}
                      >{`What happens next?`}</Heading>
                      <p>{`The property manager will contact applicants in preference order. They will start with the highest priority preference.  If the property manager contacts you, they will ask you to provide documentation to support what you answered in the application. That documentation could include paystubs, for example. They might also need to gather more information by asking you to complete a supplemental application.`}</p>
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
