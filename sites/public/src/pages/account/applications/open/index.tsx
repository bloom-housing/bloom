import React, { useEffect, useState, Fragment, useContext } from "react"
import Head from "next/head"
import { t, LoadingOverlay, NavigationContext } from "@bloom-housing/ui-components"
import { Button, Card, Heading, Tabs } from "@bloom-housing/ui-seeds"
import {
  PageView,
  pushGtmEvent,
  AuthContext,
  RequireLogin,
  BloomCard,
} from "@bloom-housing/shared-helpers"
import Layout from "../../../layouts/application"
import { StatusItemWrapper, AppWithListing } from "../StatusItemWrapper"
import { MetaTags } from "../../../components/shared/MetaTags"
import { UserStatus } from "../../../lib/constants"

import styles from "../../../../pages/account/account.module.scss"
import { useRouter } from "next/router"

const Applications = () => {
  const { applicationsService, listingsService, profile } = useContext(AuthContext)
  const [applications, setApplications] = useState<AppWithListing[]>()
  const [loading, setLoading] = useState(true)
  const [listLoading, setListLoading] = useState(true)
  const [error, setError] = useState()
  const router = useRouter()

  useEffect(() => {
    if (profile) {
      pushGtmEvent<PageView>({
        event: "pageView",
        pageTitle: "My Applications",
        status: UserStatus.LoggedIn,
      })
      applicationsService
        .list({ userId: profile.id })
        .then((apps) => {
          apps?.items?.length > 0 ? setApplications(apps.items) : setLoading(false)
        })
        .catch((err) => {
          console.error(`Error fetching applications: ${err}`)
          setError(err)
          setLoading(false)
        })
    }
  }, [profile, applicationsService])

  useEffect(() => {
    if (!applications || (applications && !listLoading)) return

    void Promise.all(
      applications?.map(async (app) => {
        const retrievedListing = await listingsService.retrieve({ id: app?.listings.id })
        app.fullListing = retrievedListing
        return app
      })
    )
      .then((res) => {
        setListLoading(false)
        setApplications(res)
        setLoading(false)
      })
      .catch((err) => {
        console.error(`Error fetching applications: ${err}`)
        setError(err)
        setLoading(false)
      })
  }, [applications, listLoading, listingsService])

  const noApplicationsSection = () => {
    return (
      <Card.Section className={styles["account-card-applications-section"]}>
        <div className={styles["application-no-results"]}>
          {error ? (
            <Heading priority={2} size="xl">{`${t("account.errorFetchingApplications")}`}</Heading>
          ) : (
            <>
              <Heading priority={2} className={styles["application-no-results-text"]} size="xl">
                {t("account.noApplications")}
              </Heading>
              <Button size="sm" variant="primary-outlined" href="/listings">
                {t("listings.browseListings")}
              </Button>
            </>
          )}
        </div>
      </Card.Section>
    )
  }
  const selectionHandler = (index: number) => {
    const baseUrl = "/account/applications"
    switch (index) {
      case 0:
        return baseUrl
      case 1:
        return `${baseUrl}/lottery`
      case 2:
        return `${baseUrl}/open`
      case 3:
        return `${baseUrl}/closed`
    }
  }
  return (
    <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
      <Layout>
        <Head>
          <title>{t("account.myApplications")}</title>
        </Head>
        <MetaTags title={t("account.myApplications")} description="" />
        <section className="bg-gray-300 border-t border-gray-450">
          <div className="flex flex-row relative max-w-5xl mx-auto md:py-8 px-6">
            <Tabs verticalSidebar onSelect={(index) => void router.push(selectionHandler(index))}>
              <Tabs.TabList>
                <Tabs.Tab>{t("account.allMyApplications")}</Tabs.Tab>
                <Tabs.Tab>{t("account.lotteryRun")}</Tabs.Tab>
                <Tabs.Tab>{t("account.openApplications")}</Tabs.Tab>
                <Tabs.Tab>{t("account.closedApplications")}</Tabs.Tab>
              </Tabs.TabList>
            </Tabs>
            <BloomCard
              iconSymbol="application"
              title={t("account.myApplications")}
              subtitle={t("account.myApplicationsSubtitle")}
              headingPriority={1}
            >
              <>
                <LoadingOverlay isLoading={loading}>
                  <Fragment>
                    {applications?.map((application, index) => {
                      return <StatusItemWrapper key={index} application={application} />
                    })}
                  </Fragment>
                </LoadingOverlay>

                {!applications && !loading && noApplicationsSection()}
              </>
            </BloomCard>
          </div>
        </section>
      </Layout>
    </RequireLogin>
  )
}

export default Applications
