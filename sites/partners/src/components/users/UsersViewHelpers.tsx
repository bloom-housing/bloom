import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Tabs } from "@bloom-housing/ui-seeds"

export enum UsersIndexEnum {
  partners = 0,
  advocates,
}

export const getUsersTabs = (selectedIndex: UsersIndexEnum) => {
  return (
    <Tabs
      verticalSidebar
      selectedIndex={selectedIndex}
      navigation={true}
      navigationLabel={t("users.navLabel")}
    >
      <Tabs.TabList>
        <Tabs.Tab
          href={"/users"}
          data-testid="users-partners-tab"
          active={selectedIndex === UsersIndexEnum.partners}
        >
          <span>{t("users.tabPartners")}</span>
        </Tabs.Tab>
        <Tabs.Tab
          href={"/users/advocates"}
          data-testid="users-advocates-tab"
          active={selectedIndex === UsersIndexEnum.advocates}
        >
          <span>{t("users.tabAdvocatesPublic")}</span>
        </Tabs.Tab>
      </Tabs.TabList>
    </Tabs>
  )
}
