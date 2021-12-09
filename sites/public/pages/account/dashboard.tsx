import React, { Component } from "react"
import Head from "next/head"
import {
  DashBlock,
  DashBlocks,
  HeaderBadge,
  Icon,
  RequireLogin,
  t,
  SiteAlert,
  AlertBox,
} from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"
import { NextRouter, withRouter } from "next/router"
import { MetaTags } from "../../src/MetaTags"

interface DashboardProps {
  router: NextRouter
}

class Dashboard extends Component<DashboardProps> {
  state = { alertMessage: null }
  public componentDidMount() {
    const alert = this.props.router.query?.alert
    this.setState({ alertMessage: alert })
  }

  public closeAlert = () => {
    void this.props.router.push("/account/dashboard", undefined, { shallow: true })
    this.setState({
      alertMessage: null,
    })
  }

  public render() {
    const settingsIcon = (
      <span className="header-badge">
        <Icon size="medium" symbol="settings" />
      </span>
    )
    console.log(this.props.router.query)
    console.log(this.state.alertMessage)

    return (
      <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
        <Layout>
          <Head>
            <title>{t("nav.myDashboard")}</title>
          </Head>
          <MetaTags title={t("nav.myDashboard")} description="" />
          {this.state.alertMessage && (
            <AlertBox className="" onClose={() => this.closeAlert()} type="success">
              {t(this.state.alertMessage)}
            </AlertBox>
          )}
          <section className="bg-gray-300 border-t border-gray-450">
            <div className="max-w-5xl mx-auto md:py-8">
              <SiteAlert type="success" className="md:mb-8" timeout={30000} />

              <div className="flex flex-wrap relative">
                <DashBlocks>
                  <DashBlock
                    href="/account/applications"
                    title={t("account.myApplications")}
                    subtitle={t("account.myApplicationsSubtitle")}
                    icon={<HeaderBadge />}
                    dataTestId={"account-dashboard-applications"}
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
}

export default withRouter(Dashboard)
