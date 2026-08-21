import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { Tabs } from "@bloom-housing/ui-seeds"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum, UserRole } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export enum SettingsIndexEnum {
  preferences = 0,
  properties,
  agencies,
  translations,
  content,
}

type SettingsTabsFeatureFlags = {
  enablePreferences: boolean
  enableProperties: boolean
  enableAgencies?: boolean
  enableTranslations?: boolean
  enableContent?: boolean
}

export const getVisibleSettingsTabs = (
  {
    enablePreferences,
    enableProperties,
    enableAgencies,
    enableTranslations,
    enableContent,
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
    content: !!enableContent && !!userRoles?.isAdmin,
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
    content: enableContent,
  } = getVisibleSettingsTabs(featureFlags, userRoles)

  const baseUrl = "/settings"
  const enabledTabs: SettingsIndexEnum[] = []
  if (enablePreferences) enabledTabs.push(SettingsIndexEnum.preferences)
  if (enableProperties) enabledTabs.push(SettingsIndexEnum.properties)
  if (enableAgencies) enabledTabs.push(SettingsIndexEnum.agencies)
  if (enableTranslations) enabledTabs.push(SettingsIndexEnum.translations)
  if (enableContent) enabledTabs.push(SettingsIndexEnum.content)

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
        {enableContent && (
          <Tabs.Tab
            href={`${baseUrl}/content`}
            data-testid="content-tab"
            active={selectedIndex === SettingsIndexEnum.content}
          >
            <span>{t("settings.content")}</span>
          </Tabs.Tab>
        )}
      </Tabs.TabList>
    </Tabs>
  )
}

export const useSettingsTabs = (selectedIndex: SettingsIndexEnum) => {
  const { profile, doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const enableDbDrivenContent = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableDbDrivenContent
  )
  const enableV2MSQ = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableV2MSQ)
  const featureFlags: SettingsTabsFeatureFlags = {
    enablePreferences: !doJurisdictionsHaveFeatureFlagOn(
      FeatureFlagEnum.disableListingPreferences,
      null,
      true
    ),
    enableProperties: doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableProperties),
    enableAgencies: doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableHousingAdvocate),
    enableTranslations: enableDbDrivenContent,
    enableContent: enableDbDrivenContent,
  }

  return {
    ...featureFlags,
    enableV2MSQ,
    hideTabs: getEnabledSettingsTabCount(featureFlags, profile?.userRoles) <= 1,
    tabs: getSettingsTabs(selectedIndex, enableV2MSQ, featureFlags, profile?.userRoles),
  }
}
