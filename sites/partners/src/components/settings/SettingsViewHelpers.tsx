import React from "react"
import { NextRouter } from "next/router"
import { t } from "@bloom-housing/ui-components"
import { Tabs } from "@bloom-housing/ui-seeds"

export enum SettingsIndexEnum {
  preferences = 0,
  properties,
}

export const getSettingsTabs = (selectedIndex: SettingsIndexEnum, router: NextRouter) => {
  const baseUrl = "/settings/"
  return (
    <Tabs
      verticalSidebar
      onSelect={(index) => void router.push(`${baseUrl}/${SettingsIndexEnum[index]}`)}
      selectedIndex={selectedIndex}
    >
      <Tabs.TabList>
        <Tabs.Tab data-testid="preferences-tab">
          <span>{t("settings.preferences")}</span>
        </Tabs.Tab>
        <Tabs.Tab data-testid="properties-tab">
          <span>{t("settings.properties")}</span>
        </Tabs.Tab>
      </Tabs.TabList>
    </Tabs>
  )
}
