import React from "react"
import Head from "next/head"
import { useRouter } from "next/router"

import Layout from "../../layouts/application"
import { t } from "@bloom-housing/ui-components"

const Flag = () => {
  const router = useRouter()
  const flagId = router.query.id as string

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>

      <article>Flag: {flagId}</article>
    </Layout>
  )
}

export default Flag
