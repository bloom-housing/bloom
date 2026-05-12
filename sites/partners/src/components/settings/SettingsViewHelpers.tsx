import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Tabs } from "@bloom-housing/ui-seeds"

export enum SettingsIndexEnum {
  preferences = 0,
  properties,
  agencies,
}

type SettingsTabsFeatureFlags = {
  enablePreferences: boolean
  enableProperties: boolean
  enableAgencies?: boolean
}

export const getEnabledSettingsTabCount = ({
  enablePreferences,
  enableProperties,
  enableAgencies,
}: SettingsTabsFeatureFlags) =>
  [enablePreferences, enableProperties, enableAgencies].filter(Boolean).length

export const getSettingsTabs = (
  selectedIndex: SettingsIndexEnum,
  enableV2MSQ: boolean,
  { enablePreferences, enableProperties, enableAgencies }: SettingsTabsFeatureFlags
) => {
  const baseUrl = "/settings/"
  const enabledTabs = [
    enablePreferences && SettingsIndexEnum.preferences,
    enableProperties && SettingsIndexEnum.properties,
    enableAgencies && SettingsIndexEnum.agencies,
  ].filter((tab): tab is SettingsIndexEnum => tab !== false && tab !== undefined)

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
      </Tabs.TabList>
    </Tabs>
  )
}
