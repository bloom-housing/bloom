import React from "react"
import { RequireLogin } from "@bloom-housing/shared-helpers"
import { fetchAgencies, fetchJurisdictionByName } from "../../lib/hooks"
import {
  Agency,
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { TabView } from "@bloom-housing/shared-helpers/src/views/components/TabView"
import { isFeatureFlagOn } from "../../lib/helpers"
import { t } from "@bloom-housing/ui-components"
import { EditAccountView } from "../../components/account/EditAccountView"
import {
  getAccountSettingsTabs,
  SettingsIndexEnum,
} from "../../components/account/AccountSettingsHelpers"
import { ApplicationTimeout } from "../../components/applications/ApplicationTimeout"
import Layout from "../../layouts/application"
import styles from "./account.module.scss"
import MaxWidthLayout from "../../layouts/max-width"

interface EditProps {
  agencies: Agency[]
  jurisdiction: Jurisdiction
}

const Edit = (props: EditProps) => {
  const enableNotificationSettings = isFeatureFlagOn(
    props.jurisdiction,
    FeatureFlagEnum.enableCustomListingNotifications
  )

  return (
    <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
      <ApplicationTimeout />
      <Layout
        pageTitle={t("account.accountSettings")}
        metaDescription={t("pageDescription.accountSettings")}
      >
        <section className={styles["settings-page-view"]}>
          <MaxWidthLayout>
            <TabView
              hideTabs={!enableNotificationSettings}
              tabs={getAccountSettingsTabs(SettingsIndexEnum.profile)}
              styles={{ parentStyles: styles["settings-page-view"] }}
            >
              <EditAccountView agencies={props.agencies} tabbedView={enableNotificationSettings} />
            </TabView>
          </MaxWidthLayout>
        </section>
      </Layout>
    </RequireLogin>
  )
}

export default Edit

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { req: any; query: any }) {
  const jurisdiction = await fetchJurisdictionByName(context.req)
  const agencies = await fetchAgencies(context.req, jurisdiction?.id)

  return {
    props: { jurisdiction, agencies: agencies?.items || [] },
  }
}
