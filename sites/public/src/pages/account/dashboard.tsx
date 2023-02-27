import React, { useEffect, useState, useContext } from "react"
import Head from "next/head"
import { NextRouter, withRouter } from "next/router"
import { DashBlock, DashBlocks, t, SiteAlert } from "@bloom-housing/ui-components"
import { Icon } from "../../../../../detroit-ui-components/src/icons/Icon"
import { AlertBox } from "../../../../../detroit-ui-components/src/notifications/AlertBox"
import { PageView, pushGtmEvent, AuthContext, RequireLogin } from "@bloom-housing/shared-helpers"
import Layout from "../../layouts/application"
import { MetaTags } from "../../components/shared/MetaTags"
import { UserStatus } from "../../lib/constants"

interface DashboardProps {
  router: NextRouter
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

  const settingsIcon = (
    <span className="header-badge">
      <Icon size="medium" symbol="settings" />
    </span>
  )

  const myFavoritesIcon = (
    <span className="header-badge">
      <Icon size="medium" symbol="likeFill" fill="#E94761" iconClass="ui-icon__filledRed" />
    </span>
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

            <div className="flex flex-wrap relative">
              <DashBlocks>
                <DashBlock
                  href="/account/favorites"
                  title={t("account.myFavorites")}
                  subtitle={t("account.myFavoritesSubtitle")}
                  icon={myFavoritesIcon}
                  dataTestId={"account-my-favorites"}
                ></DashBlock>
                <DashBlock
                  href="/account/edit"
                  title={t("account.accountSettings")}
                  subtitle={t("account.accountSettingsSubtitle")}
                  icon={settingsIcon}
                  dataTestId={"account-dashboard-settings"}
                ></DashBlock>
              </DashBlocks>
            </div>
          </div>
        </section>
      </Layout>
    </RequireLogin>
  )
}

export default withRouter(Dashboard)
