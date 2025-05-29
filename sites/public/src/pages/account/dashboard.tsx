import React, { useEffect, useState, useContext } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t, AlertBox } from "@bloom-housing/ui-components"
import {
  PageView,
  pushGtmEvent,
  AuthContext,
  RequireLogin,
  BloomCard,
} from "@bloom-housing/shared-helpers"
import { Button, Card, Grid } from "@bloom-housing/ui-seeds"
import Layout from "../../layouts/application"
import { MetaTags } from "../../components/shared/MetaTags"
import { UserStatus } from "../../lib/constants"
import MaxWidthLayout from "../../layouts/max-width"
import { isFeatureFlagOn, setFeatureFlagLocalStorage } from "../../lib/helpers"
import { fetchJurisdictionByName } from "../../lib/hooks"

import styles from "./account.module.scss"

interface DashboardProps {
  jurisdiction: Jurisdiction
}

function Dashboard(props: DashboardProps) {
  const { profile } = useContext(AuthContext)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (profile) {
      pushGtmEvent<PageView>({
        event: "pageView",
        pageTitle: "My Dashboard",
        status: UserStatus.LoggedIn,
      })
    }
    if (router.query?.alert) {
      const alert = Array.isArray(router.query.alert) ? router.query.alert[0] : router.query.alert
      setAlertMessage(alert)
    }

    setFeatureFlagLocalStorage(
      props.jurisdiction,
      FeatureFlagEnum.enableListingFavoriting,
      "show-favorites-menu-item"
    )
    setFeatureFlagLocalStorage(
      props.jurisdiction,
      FeatureFlagEnum.disableCommonApplication,
      "hide-applications-menu-item"
    )
  }, [router, props.jurisdiction, profile])

  const closeAlert = () => {
    void router.push("/account/dashboard", undefined, { shallow: true })
    setAlertMessage(null)
  }

  return (
    <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
      <Layout>
        <Head>
          <title>{t("nav.myDashboard")}</title>
        </Head>
        <MetaTags title={t("nav.myDashboard")} description="" />
        {alertMessage && (
          <AlertBox className="" onClose={() => closeAlert()} type="success">
            {t(alertMessage)}
          </AlertBox>
        )}
        <section className="bg-gray-300 border-t border-gray-450">
          <MaxWidthLayout className={styles["dashboard-max-width-layout"]}>
            <h1 className={"sr-only"}>{t("nav.myDashboard")}</h1>
            <Grid spacing="lg" className={styles["account-card-container"]}>
              <Grid.Row columns={2}>
                {isFeatureFlagOn(props.jurisdiction, FeatureFlagEnum.disableCommonApplication) ? (
                  <></>
                ) : (
                  <Grid.Cell>
                    <BloomCard
                      customIcon="application"
                      title={t("account.myApplications")}
                      subtitle={t("account.myApplicationsSubtitle")}
                      variant={"block"}
                      headingPriority={2}
                    >
                      <Card.Section>
                        <Button
                          size="sm"
                          href={"/account/applications"}
                          variant="primary-outlined"
                          id="account-dashboard-applications"
                        >
                          {t("account.viewApplications")}
                        </Button>
                      </Card.Section>
                    </BloomCard>
                  </Grid.Cell>
                )}
                <Grid.Cell>
                  <BloomCard
                    customIcon="profile"
                    title={t("account.accountSettings")}
                    subtitle={t("account.accountSettingsSubtitle")}
                    id="account-dashboard-settings"
                    variant={"block"}
                    headingPriority={2}
                  >
                    <Card.Section>
                      <Button
                        size="sm"
                        href={"/account/edit"}
                        variant="primary-outlined"
                        id={"account-dashboard-settings"}
                      >
                        {t("account.accountSettingsUpdate")}
                      </Button>
                    </Card.Section>
                  </BloomCard>
                </Grid.Cell>
                {isFeatureFlagOn(props.jurisdiction, FeatureFlagEnum.enableListingFavoriting) ? (
                  <Grid.Cell>
                    <BloomCard
                      iconSymbol="heartIcon"
                      iconOutlined={true}
                      title={t("account.myFavorites")}
                      subtitle={t("account.myFavoritesSubtitle")}
                      id="account-dashboard-favorites"
                      variant={"block"}
                      headingPriority={2}
                    >
                      <Card.Section>
                        <Button
                          size="sm"
                          href={"/account/favorites"}
                          variant="primary-outlined"
                          id={"account-dashboard-favorites"}
                        >
                          {t("account.viewFavorites")}
                        </Button>
                      </Card.Section>
                    </BloomCard>
                  </Grid.Cell>
                ) : (
                  <></>
                )}
              </Grid.Row>
            </Grid>
          </MaxWidthLayout>
        </section>
      </Layout>
    </RequireLogin>
  )
}

export default Dashboard

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStaticProps() {
  const jurisdiction = await fetchJurisdictionByName()

  return {
    props: { jurisdiction },
  }
}
