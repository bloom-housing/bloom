import React from "react"
import Head from "next/head"
import { PageHeader, t } from "@bloom-housing/ui-components"

import Layout from "../../layouts"

const Users = () => {
  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>

      <PageHeader className="relative" title={t("nav.users")} />
    </Layout>
  )
}

export default Users
