import React, { Component } from "react"
import Head from "next/head"
import {
  DashBlock,
  DashBlocks,
  HeaderBadge,
  Icon,
  MetaTags,
  RequireLogin,
  t,
} from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"

export default class extends Component {
  public render() {
    return (
      <RequireLogin signInPath={`/sign-in?message=${encodeURIComponent(t("t.loginIsRequired"))}`}>
        <Layout>
          <Head>
            <title>{t("nav.")}</title>
          </Head>
          <MetaTags title={t("nav.mySettings")} description="" />
          <div className="p-16" style={{ background: "#f6f6f6" }}>
            <DashBlocks>
              <DashBlock
                href="/account/applications"
                title={t("account.myApplications")}
                subtitle={t("account.myApplicationsSubtitle")}
                icon={<HeaderBadge />}
              ></DashBlock>
              <DashBlock
                href="/account/settings"
                title={t("account.accountSettings")}
                subtitle={t("account.accountSettingsSubtitle")}
                icon={
                  <span className="header-badge">
                    <Icon size="medium" symbol="settings" />
                  </span>
                }
              ></DashBlock>
            </DashBlocks>
          </div>
        </Layout>
      </RequireLogin>
    )
  }
}
