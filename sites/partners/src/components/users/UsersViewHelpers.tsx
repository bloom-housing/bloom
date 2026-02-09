import React from "react"
import { NextRouter } from "next/router"
import { t } from "@bloom-housing/ui-components"
import { Tabs } from "@bloom-housing/ui-seeds"

export enum UsersIndexEnum {
  partners = 0,
  advocates,
}

export const getUsersTabs = (selectedIndex: UsersIndexEnum, router: NextRouter) => {
  return (
    <Tabs
      verticalSidebar
      onSelect={(index) => {
        void router.push(index === UsersIndexEnum.partners ? "/users" : "/users/advocates")
      }}
      selectedIndex={selectedIndex}
    >
      <Tabs.TabList>
        <Tabs.Tab data-testid="users-partners-tab">
          <span>{t("users.tabPartners")}</span>
        </Tabs.Tab>
        <Tabs.Tab data-testid="users-advocates-tab">
          <span>{t("users.tabAdvocatesPublic")}</span>
        </Tabs.Tab>
      </Tabs.TabList>
    </Tabs>
  )
}
