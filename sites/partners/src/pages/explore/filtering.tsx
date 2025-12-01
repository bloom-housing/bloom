import React from "react"
import Head from "next/head"
import { t } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import { useRouter } from "next/router"
import Layout from "../../layouts"
import { NavigationHeader } from "../../components/shared/NavigationHeader"

const DataExplorer = () => {
  const router = useRouter()
  if (!process.env.enableHousingReports) {
    void router.replace("/")
  }

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")} - Data Explorer</title>
      </Head>
      <NavigationHeader className="relative" title="Data Explorer" />
      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <div className="bg-white p-8 rounded-lg shadow-sm w-full">
            <h2 className="text-2xl font-bold mb-6">Data Explorer</h2>
            <p className="text-gray-700 mb-6">
              Welcome to the Data Explorer. This page will allow you to explore and filter your
              data.
            </p>
            <Button variant="primary" onClick={() => router.push("/explore/application-analysis")}>
              Application Analysis
            </Button>
          </div>
        </article>
      </section>
    </Layout>
  )
}

export default DataExplorer
