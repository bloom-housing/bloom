import React, { useContext } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { t } from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import Layout from "../../layouts"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import TabView from "../../layouts/TabView"
import { getUsersTabs, UsersIndexEnum } from "../../components/users/UsersViewHelpers"

const Advocates = () => {
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)
  const router = useRouter()

  const enableHousingAdvocate = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableHousingAdvocate
  )

  return (
    <Layout>
      <Head>
        <title>{`Users - ${t("users.tabAdvocatesPublic")} - ${t("nav.siteTitlePartners")}`}</title>
      </Head>
      <NavigationHeader className="relative" title={t("nav.users")} />
      <TabView
        hideTabs={!enableHousingAdvocate}
        tabs={getUsersTabs(UsersIndexEnum.advocates, router)}
      >
        <section>
          <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
            TODO
          </article>
        </section>
      </TabView>
    </Layout>
  )
}

export default Advocates
