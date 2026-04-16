import { t } from "@bloom-housing/ui-components"
import { Tabs } from "@bloom-housing/ui-seeds"

export enum SettingsIndexEnum {
  profile = 0,
  notifications,
}

export const getAccountSettingsTabs = (selectedIndex: SettingsIndexEnum) => {
  const baseUrl = "/account/"

  return (
    <Tabs
      verticalSidebar
      navigation={true}
      navigationLabel={t("settings.navLabel")}
      selectedIndex={selectedIndex}
    >
      <Tabs.TabList>
        <Tabs.Tab
          href={`${baseUrl}/edit`}
          data-testid="profile-tab"
          active={selectedIndex === SettingsIndexEnum.profile}
        >
          <span>{"Profile"}</span>
        </Tabs.Tab>
        <Tabs.Tab
          href={`${baseUrl}/notifications`}
          data-testid="notifications-tab"
          active={selectedIndex === SettingsIndexEnum.notifications}
        >
          <span>{"Notifications"}</span>
        </Tabs.Tab>
      </Tabs.TabList>
    </Tabs>
  )
}
