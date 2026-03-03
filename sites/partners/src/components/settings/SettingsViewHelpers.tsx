import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Tabs } from "@bloom-housing/ui-seeds"

export enum SettingsIndexEnum {
  preferences = 0,
  properties,
}

export const getSettingsTabs = (selectedIndex: SettingsIndexEnum, enableV2MSQ: boolean) => {
  const baseUrl = "/settings/"

  return (
    <Tabs
      verticalSidebar
      navigation={true}
      navigationLabel={t("settings.navLabel")}
      selectedIndex={selectedIndex}
    >
      <Tabs.TabList>
        <Tabs.Tab
          href={`${
            enableV2MSQ ? `${baseUrl}/multiselectquestions/preferences` : `${baseUrl}/preferences`
          }`}
          data-testid="preferences-tab"
          active={selectedIndex === SettingsIndexEnum.preferences}
        >
          <span>{t("settings.preferences")}</span>
        </Tabs.Tab>
        <Tabs.Tab
          href={`${baseUrl}/properties`}
          data-testid="properties-tab"
          active={selectedIndex === SettingsIndexEnum.properties}
        >
          <span>{t("settings.properties")}</span>
        </Tabs.Tab>
      </Tabs.TabList>
    </Tabs>
  )
}
