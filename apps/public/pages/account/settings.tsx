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
      <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
        <Layout>
          <Head>
            <title>{t("nav.")}</title>
          </Head>
          <MetaTags title={t("nav.mySettings")} description="" />
          <section className="bg-gray-300">
            <div className="flex flex-wrap relative max-w-5xl mx-auto md:py-8">
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
          </section>
        </Layout>
      </RequireLogin>
    )
  }
}
