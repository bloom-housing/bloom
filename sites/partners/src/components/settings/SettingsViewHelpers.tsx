import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Tabs } from "@bloom-housing/ui-seeds"
import { UserRole } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export enum SettingsIndexEnum {
  preferences = 0,
  properties,
  agencies,
  translations,
}

type SettingsTabsFeatureFlags = {
  enablePreferences: boolean
  enableProperties: boolean
  enableAgencies?: boolean
  enableTranslations?: boolean
}

/**
 * Which tabs a role can open, matching the redirect each settings page applies to itself. A tab
 * shown to a role its page turns away is a link to /unauthorized.
 */
export const getVisibleSettingsTabs = (
  {
    enablePreferences,
    enableProperties,
    enableAgencies,
    enableTranslations,
  }: SettingsTabsFeatureFlags,
  userRoles?: UserRole
) => {
  const isPartnerOrSupport = !!userRoles?.isPartner || !!userRoles?.isSupportAdmin
  const isLimited = !!userRoles?.isLimitedJurisdictionalAdmin

  return {
    preferences: !!enablePreferences && !isPartnerOrSupport,
    properties: !!enableProperties && !isPartnerOrSupport && !isLimited,
    agencies: !!enableAgencies && !isPartnerOrSupport && !isLimited,
    // Editing translations spans every jurisdiction, so it is limited to the admin role.
    translations: !!enableTranslations && !!userRoles?.isAdmin,
  }
}

export const getEnabledSettingsTabCount = (
  featureFlags: SettingsTabsFeatureFlags,
  userRoles?: UserRole
) => Object.values(getVisibleSettingsTabs(featureFlags, userRoles)).filter(Boolean).length

export const getSettingsTabs = (
  selectedIndex: SettingsIndexEnum,
  enableV2MSQ: boolean,
  featureFlags: SettingsTabsFeatureFlags,
  userRoles?: UserRole
) => {
  const {
    preferences: enablePreferences,
    properties: enableProperties,
    agencies: enableAgencies,
    translations: enableTranslations,
  } = getVisibleSettingsTabs(featureFlags, userRoles)

  const baseUrl = "/settings"
  const enabledTabs: SettingsIndexEnum[] = []
  if (enablePreferences) enabledTabs.push(SettingsIndexEnum.preferences)
  if (enableProperties) enabledTabs.push(SettingsIndexEnum.properties)
  if (enableAgencies) enabledTabs.push(SettingsIndexEnum.agencies)
  if (enableTranslations) enabledTabs.push(SettingsIndexEnum.translations)

  return (
    <Tabs
      verticalSidebar
      navigation={true}
      navigationLabel={t("settings.navLabel")}
      selectedIndex={Math.max(enabledTabs.indexOf(selectedIndex), 0)}
    >
      <Tabs.TabList>
        {enablePreferences && (
          <Tabs.Tab
            href={`${
              enableV2MSQ ? `${baseUrl}/multiselectquestions/preferences` : `${baseUrl}/preferences`
            }`}
            data-testid="preferences-tab"
            active={selectedIndex === SettingsIndexEnum.preferences}
          >
            <span>{t("settings.preferences")}</span>
          </Tabs.Tab>
        )}
        {enableProperties && (
          <Tabs.Tab
            href={`${baseUrl}/properties`}
            data-testid="properties-tab"
            active={selectedIndex === SettingsIndexEnum.properties}
          >
            <span>{t("settings.properties")}</span>
          </Tabs.Tab>
        )}
        {enableAgencies && (
          <Tabs.Tab
            href={`${baseUrl}/agencies`}
            data-testid="agencies-tab"
            active={selectedIndex === SettingsIndexEnum.agencies}
          >
            <span>{t("settings.agencies")}</span>
          </Tabs.Tab>
        )}
        {enableTranslations && (
          <Tabs.Tab
            href={`${baseUrl}/translations`}
            data-testid="translations-tab"
            active={selectedIndex === SettingsIndexEnum.translations}
          >
            <span>{t("settings.translations")}</span>
          </Tabs.Tab>
        )}
      </Tabs.TabList>
    </Tabs>
  )
}
