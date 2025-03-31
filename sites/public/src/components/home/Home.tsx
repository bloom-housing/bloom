import React, { useContext, useEffect } from "react"
import Head from "next/head"
import { Jurisdiction } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import { Button, Card, Grid, Heading } from "@bloom-housing/ui-seeds"
import { PageView, pushGtmEvent, AuthContext, BloomCard } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import { ConfirmationModal } from "../../components/account/ConfirmationModal"
import { MetaTags } from "../../components/shared/MetaTags"
import MaxWidthLayout from "../../layouts/max-width"
import styles from "./Home.module.scss"

interface HomeProps {
  jurisdiction: Jurisdiction
}

export const Home = (props: HomeProps) => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Housing Portal",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const heroTitle = t("welcome.title")

  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} description={metaDescription} />
      <div className={styles["home-page"]}>
        <MaxWidthLayout className={styles["hero-container"]}>
          <div className={styles["hero"]}>
            <Heading priority={1} className={styles["heading"]}>
              {heroTitle}
            </Heading>
            <p className={styles["subtitle"]}>{t("welcome.subtitle")}</p>
            <div className={styles["hero-buttons"]}>
              <Button href="/listings" variant="warn" className={styles["hero-button"]}>
                {t("welcome.seeRentalListings")}
              </Button>
              <Button href="/finder" variant="primary" className={styles["hero-button"]}>
                {t("welcome.findRentalsForYou")}
              </Button>
            </div>
          </div>
        </MaxWidthLayout>
        <MaxWidthLayout>
          <Grid spacing="lg" className={styles["account-card-container"]}>
            <Grid.Row columns={2}>
              {props.jurisdiction && props.jurisdiction.notificationsSignUpUrl && (
                <Grid.Cell>
                  <BloomCard
                    iconSymbol={"envelope"}
                    title={t("welcome.signUp")}
                    variant={"block"}
                    headingPriority={2}
                    className={styles["resource"]}
                    iconClass={styles["resource-icon"]}
                  >
                    <Card.Section>
                      <Button
                        key={"sign-up"}
                        href={props.jurisdiction.notificationsSignUpUrl}
                        variant="primary-outlined"
                        size={"sm"}
                      >
                        {t("welcome.signUpToday")}
                      </Button>
                    </Card.Section>
                  </BloomCard>
                </Grid.Cell>
              )}
              <Grid.Cell>
                <BloomCard
                  iconSymbol="home"
                  title={t("welcome.seeMoreOpportunitiesTruncated")}
                  variant={"block"}
                  headingPriority={2}
                  className={styles["resource"]}
                  iconClass={styles["resource-icon"]}
                >
                  <Card.Section>
                    <Button
                      key={"additional-resources"}
                      href="/additional-resources"
                      variant="primary-outlined"
                      size={"sm"}
                    >
                      {t("welcome.viewAdditionalHousingTruncated")}
                    </Button>
                  </Card.Section>
                </BloomCard>
              </Grid.Cell>
            </Grid.Row>
          </Grid>
        </MaxWidthLayout>
        <ConfirmationModal />
      </div>
    </Layout>
  )
}
