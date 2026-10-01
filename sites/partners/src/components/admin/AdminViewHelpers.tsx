import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { Tabs } from "@bloom-housing/ui-seeds"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum, UserRole } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export enum AdminIndexEnum {
  translations = 0,
  content,
  branding,
  transfer,
  featureFlags,
}

type AdminTabsFeatureFlags = {
  enableContent?: boolean
  enableBranding?: boolean
}

const ADMIN_TABS: Record<AdminIndexEnum, { href: string; labelKey: string; testId: string }> = {
  [AdminIndexEnum.translations]: {
    href: "/admin/translations",
    labelKey: "settings.translations",
    testId: "translations-tab",
  },
  [AdminIndexEnum.content]: {
    href: "/admin/content",
    labelKey: "settings.content",
    testId: "content-tab",
  },
  [AdminIndexEnum.branding]: {
    href: "/admin/branding",
    labelKey: "settings.branding",
    testId: "branding-tab",
  },
  [AdminIndexEnum.transfer]: {
    href: "/admin/transfer",
    labelKey: "settings.transfer",
    testId: "transfer-tab",
  },
  [AdminIndexEnum.featureFlags]: {
    href: "/admin/feature-flags",
    labelKey: "admin.featureFlags",
    testId: "feature-flags-tab",
  },
}

export const adminPath = (tab: AdminIndexEnum) => ADMIN_TABS[tab].href

export const getVisibleAdminTabs = (
  { enableContent, enableBranding }: AdminTabsFeatureFlags,
  userRoles?: UserRole
): AdminIndexEnum[] => {
  if (!userRoles?.isSuperAdmin) return []

  return [
    ...(enableContent ? [AdminIndexEnum.translations, AdminIndexEnum.content] : []),
    ...(enableBranding ? [AdminIndexEnum.branding] : []),
    ...(enableContent || enableBranding ? [AdminIndexEnum.transfer] : []),
    AdminIndexEnum.featureFlags,
  ]
}

export const useAdminTabs = (selectedIndex: AdminIndexEnum) => {
  const { profile, doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const featureFlags = {
    enableContent: doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableDbDrivenContent),
    enableBranding: doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableDbDrivenBranding),
  }
  const visibleTabs = getVisibleAdminTabs(featureFlags, profile?.userRoles)

  return {
    ...featureFlags,
    visibleTabs,
    hideTabs: visibleTabs.length <= 1,
    tabs: (
      <Tabs
        verticalSidebar
        navigation={true}
        navigationLabel={t("admin.navLabel")}
        selectedIndex={Math.max(visibleTabs.indexOf(selectedIndex), 0)}
      >
        <Tabs.TabList>
          {visibleTabs.map((tab) => (
            <Tabs.Tab
              key={tab}
              href={ADMIN_TABS[tab].href}
              data-testid={ADMIN_TABS[tab].testId}
              active={selectedIndex === tab}
            >
              <span>{t(ADMIN_TABS[tab].labelKey)}</span>
            </Tabs.Tab>
          ))}
        </Tabs.TabList>
      </Tabs>
    ),
  }
}
