import React, { useEffect, useContext, useState } from "react"
import Head from "next/head"
import Layout from "../layouts/application"
import { t, PageHeader } from "@bloom-housing/ui-components"
import { UserStatus } from "../lib/constants"
import { AuthContext, PageView, pushGtmEvent } from "@bloom-housing/shared-helpers"

const getAdditionalResourcesSection = async (jurisdiction: string) => {
  return import(
    `../page_content/jurisdiction_overrides/${jurisdiction
      .toLowerCase()
      .replace(" ", "_")}/additional-resources-section`
  )
}

const AdditionalResources = () => {
  const pageTitle = t("pageTitle.additionalResources")
  const subTitle = t("pageDescription.additionalResources")
  const { profile } = useContext(AuthContext)
  const [additionalResources, setAdditionalResources] = useState()

  useEffect(() => {
    const loadPageContent = async () => {
      const additionalResources = await getAdditionalResourcesSection(
        process.env.jurisdictionName || ""
      )
      setAdditionalResources(additionalResources.AdditionalResourcesSection)
    }
    loadPageContent().catch(() => {
      console.log("additional-resources-section doesn't exist")
    })
  }, [])

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Additional Resources",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <Layout>
      <Head>
        <title>
          {pageTitle} - {t("nav.siteTitle")}
        </title>
      </Head>
      <PageHeader title={<>{pageTitle}</>} subtitle={subTitle} inverse={true}></PageHeader>

      {additionalResources}
    </Layout>
  )
}

export default AdditionalResources
