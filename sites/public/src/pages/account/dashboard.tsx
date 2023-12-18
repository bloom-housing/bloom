import React, { useEffect, useState, useContext } from "react"
import Head from "next/head"
import { NextRouter, withRouter } from "next/router"
import { t, SiteAlert, AlertBox, Icon, UniversalIconType } from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent, AuthContext, RequireLogin } from "@bloom-housing/shared-helpers"
import Layout from "../../layouts/application"
import { MetaTags } from "../../components/shared/MetaTags"
import { UserStatus } from "../../lib/constants"
import { Button, Card, HeadingGroup } from "@bloom-housing/ui-seeds"

import styles from "./account.module.scss"

interface DashboardProps {
  router: NextRouter
}

interface AccountCardProps {
  iconSymbol: UniversalIconType
  title: string
  subtitle: string
  buttonText: string
  link: string
}

function Dashboard(props: DashboardProps) {
  const { profile } = useContext(AuthContext)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      pushGtmEvent<PageView>({
        event: "pageView",
        pageTitle: "My Dashboard",
        status: UserStatus.LoggedIn,
      })
    }
    if (props.router.query?.alert) {
      const alert = Array.isArray(props.router.query.alert)
        ? props.router.query.alert[0]
        : props.router.query.alert
      setAlertMessage(alert)
    }
  }, [props.router, profile])

  const closeAlert = () => {
    void props.router.push("/account/dashboard", undefined, { shallow: true })
    setAlertMessage(null)
  }

  const AccountCard = ({ iconSymbol, title, subtitle, buttonText, link }: AccountCardProps) => (
    <Card spacing="xl" className={styles.accountCard}>
      <Card.Section>
        <Icon size="2xl" symbol={iconSymbol} />
        <HeadingGroup size="2xl" heading={title} subheading={subtitle}></HeadingGroup>
      </Card.Section>
      <Card.Section>
        <Button href={link} variant="primary-outlined">
          {buttonText}
        </Button>
      </Card.Section>
    </Card>
  )

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
          <div className="max-w-5xl mx-auto md:py-8">
            <SiteAlert type="success" className="md:mb-8" timeout={30000} />

            <div className="flex px-6 gap-8">
              <h1 className={"sr-only"}>{t("nav.myDashboard")}</h1>
              <AccountCard
                iconSymbol="application"
                title={t("account.myApplications")}
                subtitle={t("account.myApplicationsSubtitle")}
                buttonText={t("account.viewApplications")}
                link="/account/applications"
              />
              <AccountCard
                iconSymbol="profile"
                title={t("account.accountSettings")}
                subtitle={t("account.accountSettingsSubtitle")}
                buttonText={t("account.accountSettingsUpdate")}
                link="/account/edit"
              />
            </div>
          </div>
        </section>
      </Layout>
    </RequireLogin>
  )
}

export default withRouter(Dashboard)
