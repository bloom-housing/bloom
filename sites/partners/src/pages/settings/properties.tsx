import React, { useContext } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { t } from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import TabView from "../../layouts/TabView"
import Layout from "../../layouts"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import { getSettingsTabs, SettingsIndexEnum } from "../../components/settings/SettingsViewHelpers"

const SettingsProperties = () => {
  const router = useRouter()
  const { profile, doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)
  const enableProperties = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableProperties)
  const atLeastOneJurisdictionEnablesPreferences = !doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.disableListingPreferences,
    null,
    true
  )

  if (profile?.userRoles?.isPartner || profile?.userRoles?.isSupportAdmin || !enableProperties) {
    void router.push("/unauthorized")
  }

  return (
    <>
      <Layout>
        <Head>
          <title>{`Settings - Properties - ${t("nav.siteTitlePartners")}`}</title>
        </Head>
        <NavigationHeader className="relative" title={t("t.settings")} />
        <TabView
          hideTabs={!(atLeastOneJurisdictionEnablesPreferences && enableProperties)}
          tabs={getSettingsTabs(SettingsIndexEnum.properties, router)}
        >
          TODO
        </TabView>
      </Layout>
    </>
  )
}

export default SettingsProperties
