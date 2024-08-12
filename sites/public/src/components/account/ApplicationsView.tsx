import React, { useEffect, useState, Fragment, useContext } from "react"
import Head from "next/head"
import { t, LoadingOverlay } from "@bloom-housing/ui-components"
import { Button, Card, Heading, Tabs } from "@bloom-housing/ui-seeds"
import {
  PageView,
  pushGtmEvent,
  AuthContext,
  RequireLogin,
  BloomCard,
} from "@bloom-housing/shared-helpers"
import Layout from "../../layouts/application"
import { StatusItemWrapper, AppWithListing } from "./StatusItemWrapper"
import { MetaTags } from "../shared/MetaTags"
import { UserStatus } from "../../lib/constants"

import styles from "./ApplicationsView.module.scss"
import {
  ListingsStatusEnum,
  LotteryStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useRouter } from "next/router"

export enum ApplicationsFilterEnum {
  All = 0,
  Lottery,
  Closed,
  Open,
}
interface ApplicationsCount {
  total: number
  lottery: number
  open: number
  closed: number
}

interface ApplicationsViewProps {
  filterType: ApplicationsFilterEnum
}

const ApplicationsView = (props: ApplicationsViewProps) => {
  const { applicationsService, listingsService, profile } = useContext(AuthContext)
  const [applications, setApplications] = useState<AppWithListing[]>()
  const [applicationsCount, setApplicationsCount] = useState<ApplicationsCount>()
  const [loading, setLoading] = useState(true)
  const [listLoading, setListLoading] = useState(true)
  const [error, setError] = useState()
  const router = useRouter()

  useEffect(() => {
    if (profile && loading) {
      pushGtmEvent<PageView>({
        event: "pageView",
        pageTitle: `My Applications - ${ApplicationsFilterEnum[props.filterType]}`,
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
        const retrievedListing = await listingsService.retrieve({
          id: app?.listings.id,
        })
        app.fullListing = retrievedListing
        return app
      })
    )
      .then((res) => {
        setListLoading(false)
        const displayApplications = []
        const total = res.length
        let open = 0,
          closed = 0,
          lottery = 0
        res.forEach((app) => {
          if (app.fullListing?.status === ListingsStatusEnum.active) {
            open++
            if (props.filterType === ApplicationsFilterEnum.Open) displayApplications.push(app)
          } else if (app.fullListing?.lotteryStatus === LotteryStatusEnum.publishedToPublic) {
            lottery++
            if (props.filterType === ApplicationsFilterEnum.Lottery) displayApplications.push(app)
          } else {
            closed++
            if (props.filterType === ApplicationsFilterEnum.Closed) displayApplications.push(app)
          }
        })
        props.filterType === ApplicationsFilterEnum.All
          ? setApplications(res)
          : setApplications(displayApplications)
        setApplicationsCount({ total, lottery, open, closed })
        setLoading(false)
      })
      .catch((err) => {
        console.error(`Error fetching applications: ${err}`)
        setError(err)
        setLoading(false)
      })
  }, [applications, listLoading, listingsService])

  const selectionHandler = (index: number) => {
    const baseUrl = "/account/applications"
    switch (index) {
      case ApplicationsFilterEnum.All:
        void router.push(baseUrl)
        break
      case ApplicationsFilterEnum.Lottery:
        void router.push(`${baseUrl}/lottery`)
        break
      case ApplicationsFilterEnum.Closed:
        void router.push(`${baseUrl}/closed`)
        break
      case ApplicationsFilterEnum.Open:
        void router.push(`${baseUrl}/open`)
        break
    }
  }

  const noApplicationsSection = () => {
    let headerText = t("account.noApplications")
    let buttonText = t("listings.browseListings")
    let buttonHref = "/listings"
    // only show custom message and redirect to "All my applications" if they have applied before
    if (applicationsCount?.total > 0) {
      buttonText = t("account.viewAllApplications")
      buttonHref = "/account/applications"
      switch (props.filterType) {
        case ApplicationsFilterEnum.Lottery:
          headerText = t("account.noLotteryApplications")
          break
        case ApplicationsFilterEnum.Closed:
          headerText = t("account.noClosedApplications")
          break
        case ApplicationsFilterEnum.Open:
          headerText = t("account.noOpenApplications")
          break
      }
    }
    return (
      <Card.Section className={styles["account-card-applications-section"]}>
        <div className={styles["application-no-results"]}>
          {error ? (
            <Heading priority={2} size="xl">{`${t("account.errorFetchingApplications")}`}</Heading>
          ) : (
            <>
              <Heading priority={2} className={styles["application-no-results-text"]} size="xl">
                {headerText}
              </Heading>
              <Button size="sm" variant="primary-outlined" href={buttonHref}>
                {buttonText}
              </Button>
            </>
          )}
        </div>
      </Card.Section>
    )
  }

  return (
    <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
      <Layout>
        <Head>
          <title>{t("account.myApplications")}</title>
        </Head>
        <MetaTags title={t("account.myApplications")} description="" />
        <section className={styles["applications-section-background"]}>
          <div className={styles["applications-section-container"]}>
            <Tabs
              verticalSidebar
              onSelect={(index) => selectionHandler(index)}
              selectedIndex={props.filterType}
            >
              <Tabs.TabList>
                <Tabs.Tab className={styles["application-count-tab"]}>
                  <span>{t("account.allMyApplications")}</span>
                  <span>{applicationsCount?.total}</span>
                </Tabs.Tab>
                <Tabs.Tab className={styles["application-count-tab"]}>
                  <span>{t("account.lotteryRun")}</span>
                  <span>{applicationsCount?.lottery}</span>
                </Tabs.Tab>
                <Tabs.Tab className={styles["application-count-tab"]}>
                  <span>{t("account.closedApplications")}</span>
                  <span>{applicationsCount?.closed}</span>
                </Tabs.Tab>
                <Tabs.Tab className={styles["application-count-tab"]}>
                  <span>{t("account.openApplications")}</span>
                  <span>{applicationsCount?.open}</span>
                </Tabs.Tab>
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
                {!applications?.length && !loading && noApplicationsSection()}
              </>
            </BloomCard>
          </div>
        </section>
      </Layout>
    </RequireLogin>
  )
}

export default ApplicationsView
