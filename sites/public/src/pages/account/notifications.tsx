import { useRouter } from "next/router"
import { TabView } from "@bloom-housing/shared-helpers/src/views/components/TabView"
import { RequireLogin } from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { isFeatureFlagOn } from "../../lib/helpers"
import { fetchJurisdictionByName } from "../../lib/hooks"
import { NotificationPreferences } from "../../components/account/NotificationPreferences"
import MaxWidthLayout from "../../layouts/max-width"
import Layout from "../../layouts/application"
import { ApplicationTimeout } from "../../components/applications/ApplicationTimeout"
import {
  getAccountSettingsTabs,
  SettingsIndexEnum,
} from "../../components/account/AccountSettingsHelpers"
import styles from "./account.module.scss"

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
          <MaxWidthLayout>
            <TabView
              hideTabs={false}
              tabs={getAccountSettingsTabs(SettingsIndexEnum.notifications)}
              styles={{ parentStyles: styles["settings-page-view"] }}
            >
              <NotificationPreferences jurisdiction={props.jurisdiction} />
            </TabView>
          </MaxWidthLayout>
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
