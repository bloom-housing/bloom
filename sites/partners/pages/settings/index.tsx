import React from "react"
import Head from "next/head"
import { PageHeader, t, SiteAlert } from "@bloom-housing/ui-components"
import Layout from "../../layouts"

const Settings = () => {
  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>

      <PageHeader className="relative" title={t("t.settings")}>
        <div className="flex top-4 right-4 absolute z-50 flex-col items-center">
          <SiteAlert type="success" timeout={5000} dismissable />
          <SiteAlert type="alert" timeout={5000} dismissable />
        </div>
      </PageHeader>

      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4"></article>
      </section>
    </Layout>
  )
}

export default Settings
