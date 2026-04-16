import { TabView } from "@bloom-housing/shared-helpers/src/views/components/TabView"
import {
  getAccountSettingsTabs,
  SettingsIndexEnum,
} from "../../components/account/AccountSettingsHelpers"
import { RequireLogin } from "@bloom-housing/shared-helpers"
import { ApplicationTimeout } from "../../components/applications/ApplicationTimeout"
import Layout from "../../layouts/application"
import { t } from "@bloom-housing/ui-components"
import styles from "./account.module.scss"
import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { isFeatureFlagOn } from "../../lib/helpers"
import { useRouter } from "next/router"
import { fetchJurisdictionByName } from "../../lib/hooks"
import { NotificationPreferences } from "../../components/account/NotificationPreferences"

interface NotificationProps {
  jurisdiction: Jurisdiction
}

const Notifications = (props: NotificationProps) => {
  const router = useRouter()
  const enableNotificationSettings = isFeatureFlagOn(
    props.jurisdiction,
    FeatureFlagEnum.enableCustomListingNotifications
  )

  if (!enableNotificationSettings) {
    void router.push("/account/edit")
  }

  return (
    <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
      <ApplicationTimeout />
      <Layout
        pageTitle={t("account.accountSettings")}
        metaDescription={t("pageDescription.accountSettings")}
      >
        <section className={styles["settings-page-view"]}>
          <TabView
            hideTabs={false}
            tabs={getAccountSettingsTabs(SettingsIndexEnum.notifications)}
            styles={{
              sectionStyles: styles["settings-page-view-section"],
            }}
          >
            <NotificationPreferences />
          </TabView>
        </section>
      </Layout>
    </RequireLogin>
  )
}

export default Notifications

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { req: any; query: any }) {
  const jurisdiction = await fetchJurisdictionByName(context.req)

  return {
    props: { jurisdiction },
  }
}
