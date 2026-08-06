import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Tabs } from "@bloom-housing/ui-seeds"

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

export const getEnabledSettingsTabCount = ({
  enablePreferences,
  enableProperties,
  enableAgencies,
  enableTranslations,
}: SettingsTabsFeatureFlags) =>
  [enablePreferences, enableProperties, enableAgencies, enableTranslations].filter(Boolean).length

export const getSettingsTabs = (
  selectedIndex: SettingsIndexEnum,
  enableV2MSQ: boolean,
  {
    enablePreferences,
    enableProperties,
    enableAgencies,
    enableTranslations,
  }: SettingsTabsFeatureFlags
) => {
  const baseUrl = "/settings/"
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
