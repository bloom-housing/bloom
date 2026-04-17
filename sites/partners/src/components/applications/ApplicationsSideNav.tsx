import React from "react"
import { useRouter } from "next/router"
import { t } from "@bloom-housing/ui-components"
import { Tabs } from "@bloom-housing/ui-seeds"
import { useFlaggedApplicationsMeta } from "../../lib/hooks"
import styles from "./ApplicationsSideNav.module.scss"

type ApplicationsSideNavProps = {
  listingId: string
  listingOpen?: boolean
}

const ApplicationsSideNav = ({ listingId, listingOpen = false }: ApplicationsSideNavProps) => {
  const router = useRouter()
  const { data } = useFlaggedApplicationsMeta(listingId)
  const tabUrls = {
    total: `/listings/${listingId}/applications`,
    pending: `/listings/${listingId}/applications/pending`,
    resolved: `/listings/${listingId}/applications/resolved`,
  }

  return (
    <>
      <Tabs verticalSidebar navigation={true} navigationLabel={t("applications.navLabel")}>
        <Tabs.TabList>
          <Tabs.Tab href={tabUrls.total} active={tabUrls.total === router.asPath}>
            <div className={styles["application-count-tab-content"]}>
              <span>{t("applications.allApplications")}</span>
              <span>{data?.totalCount || 0}</span>
            </div>
          </Tabs.Tab>
          <Tabs.Tab href={tabUrls.pending} active={tabUrls.pending === router.asPath}>
            <div className={styles["application-count-tab-content"]}>
              <span>{t("applications.pendingReview")}</span>
              <span>{data?.totalPendingCount || 0}</span>
            </div>
          </Tabs.Tab>
          {!listingOpen && (
            <Tabs.Tab href={tabUrls.resolved} active={tabUrls.resolved === router.asPath}>
              <div className={styles["application-count-tab-content"]}>
                <span>{t("t.resolved")}</span>
                <span>{data?.totalResolvedCount || 0}</span>
              </div>
            </Tabs.Tab>
          )}
        </Tabs.TabList>
      </Tabs>
    </>
  )
}

export { ApplicationsSideNav as default, ApplicationsSideNav }
