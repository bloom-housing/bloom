import React, { useEffect, useState, Fragment, useContext } from "react"
import Head from "next/head"
import { t, LoadingOverlay, SideNav } from "@bloom-housing/ui-components"
import { Button, Card, Heading } from "@bloom-housing/ui-seeds"
import { PageView, pushGtmEvent, AuthContext, RequireLogin } from "@bloom-housing/shared-helpers"
import Layout from "../../layouts/application"
import { StatusItemWrapper, AppWithListing } from "./StatusItemWrapper"
import { MetaTags } from "../../components/shared/MetaTags"
import { UserStatus } from "../../lib/constants"
import { AccountCard } from "@bloom-housing/shared-helpers/src/views/accounts/AccountCard"

import styles from "../../pages/account/account.module.scss"
import dayjs from "dayjs"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export enum filterEnum {
  "all",
  "closed",
  "open",
}

const Applications = () => {
  const { applicationsService, listingsService, profile } = useContext(AuthContext)
  const [applications, setApplications] = useState<AppWithListing[]>()
  const [displayApplications, setDisplayApplications] = useState<AppWithListing[]>()
  const [openApplications, setOpenApplications] = useState<AppWithListing[]>()
  const [closedApplications, setClosedApplications] = useState<AppWithListing[]>()
  const [applicationFilter, setApplicationFilter] = useState<filterEnum>(filterEnum.all)
  const [loading, setLoading] = useState(true)
  const [listLoading, setListLoading] = useState(true)
  const [error, setError] = useState()

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
        // separate out open and close applications for effecient filtering
        const openApps: AppWithListing[] = []
        const closedApps: AppWithListing[] = []
        res.forEach((application) => {
          const listing = application.fullListing
          if (
            (listing.status === ListingsStatusEnum.active &&
              (dayjs(new Date()).isBefore(dayjs(listing.applicationDueDate)) ||
                !listing.applicationDueDate)) ||
            listing?.waitlistOpenSpots
          )
            openApps.push(application)
          else {
            closedApps.push(application)
          }
        })
        setOpenApplications(openApps)
        setClosedApplications(closedApps)
        setLoading(false)
      })
      .catch((err) => {
        console.error(`Error fetching applications: ${err}`)
        setError(err)
        setLoading(false)
      })
  }, [applications, listLoading, listingsService])

  useEffect(() => {
    if (applications) {
      switch (applicationFilter) {
        case filterEnum.all:
          setDisplayApplications(applications)
          break
        case filterEnum.open:
          setDisplayApplications(openApplications)
          break
        case filterEnum.closed:
          setDisplayApplications(closedApplications)
          break
      }
    }
  }, [applicationFilter, applications, closedApplications, openApplications])

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
  const items = [
    {
      label: t("application.statuses.allApplications"),
      onClick: () => setApplicationFilter(filterEnum.all),
      url: "#",
      count: applications?.length,
      current: applicationFilter === filterEnum.all,
    },
    {
      label: t("application.statuses.openApplications"),
      onClick: () => setApplicationFilter(filterEnum.open),
      url: "#",
      count: openApplications?.length,
      current: applicationFilter === filterEnum.open,
    },
    {
      label: t("application.statuses.closedApplications"),
      onClick: () => setApplicationFilter(filterEnum.closed),
      url: "#",
      count: closedApplications?.length,
      current: applicationFilter === filterEnum.closed,
    },
  ]
  return (
    <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
      <Layout>
        <Head>
          <title>{t("account.myApplications")}</title>
        </Head>
        <MetaTags title={t("account.myApplications")} description="" />
        <section className="bg-gray-300 border-t border-gray-450">
          <div className="flex flex-row relative max-w-5xl mx-auto md:py-8 px-6">
            <>
              <div className={"hidden pr-8 md:block"}>
                <SideNav navItems={items} />
              </div>
              <div className={"block md:hidden mb-4 w-full sm:w-auto"}>
                <SideNav
                  className={`w-full md:w-72 side-nav__horizontal focus:outline-none`}
                  navItems={items}
                />
              </div>
            </>
            <AccountCard
              iconSymbol="application"
              title={t("account.myApplications")}
              subtitle={t("account.myApplicationsSubtitle")}
              headingPriority={1}
              divider="inset"
              thinMobile
            >
              <>
                <LoadingOverlay isLoading={loading}>
                  <Fragment>
                    {displayApplications?.map((application, index) => {
                      return <StatusItemWrapper key={index} application={application} />
                    })}
                  </Fragment>
                </LoadingOverlay>

                {!applications && !loading && noApplicationsSection()}
              </>
            </AccountCard>
          </div>
        </section>
      </Layout>
    </RequireLogin>
  )
}

export default Applications
