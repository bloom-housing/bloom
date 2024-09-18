import React, { useEffect, useState, Fragment, useContext } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
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
import { ApplicationsFilterEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { StatusItemWrapper, AppWithListing } from "./StatusItemWrapper"
import { MetaTags } from "../shared/MetaTags"
import { UserStatus } from "../../lib/constants"

import styles from "./ApplicationsView.module.scss"

export enum ApplicationsIndexEnum {
  all = 0,
  lottery,
  closed,
  open,
}
interface ApplicationsCount {
  total: number
  lottery: number
  open: number
  closed: number
}

interface ApplicationsViewProps {
  filterType: ApplicationsIndexEnum
}

const ApplicationsView = (props: ApplicationsViewProps) => {
  const { applicationsService, profile } = useContext(AuthContext)
  const [applications, setApplications] = useState<AppWithListing[]>()
  const [applicationsCount, setApplicationsCount] = useState<ApplicationsCount>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const router = useRouter()
  const showPublicLottery = process.env.showPublicLottery
  const filterTypeString = ApplicationsIndexEnum[props.filterType]

  useEffect(() => {
    if (profile && loading) {
      pushGtmEvent<PageView>({
        event: "pageView",
        pageTitle: `My Applications - ${filterTypeString}`,
        status: UserStatus.LoggedIn,
      })
      applicationsService
        .publicAppsView({
          userId: profile.id,
          filterType: ApplicationsFilterEnum[filterTypeString],
          includeLotteryApps: !!showPublicLottery,
        })
        .then((res) => {
          setApplications(res.displayApplications)
          setApplicationsCount(res.applicationsCount)
        })
        .catch((err) => {
          console.error(`Error fetching applications: ${err}`)
          setError(err)
        })
        .finally(() => setLoading(false))
    }
  }, [profile, applicationsService])

  const selectionHandler = (index: number) => {
    const baseUrl = "/account/applications"
    switch (index) {
      case ApplicationsIndexEnum.all:
        void router.push(baseUrl)
        break
      case ApplicationsIndexEnum.lottery:
        void router.push(`${baseUrl}/lottery`)
        break
      case ApplicationsIndexEnum.closed:
        void router.push(`${baseUrl}/closed`)
        break
      case ApplicationsIndexEnum.open:
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
        case ApplicationsIndexEnum.lottery:
          headerText = t("account.noLotteryApplications")
          break
        case ApplicationsIndexEnum.closed:
          headerText = showPublicLottery
            ? t("account.noClosedApplications")
            : t("account.noClosedApplicationsSimplified")
          break
        case ApplicationsIndexEnum.open:
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
                <Tabs.Tab
                  className={`${styles["application-count-tab"]} ${
                    !showPublicLottery ? styles["application-hide-tab"] : ""
                  }`}
                >
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
              customIcon="application"
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
