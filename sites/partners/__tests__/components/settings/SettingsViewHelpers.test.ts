import { UserRole } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  getEnabledSettingsTabCount,
  getVisibleSettingsTabs,
} from "../../../src/components/settings/SettingsViewHelpers"

const allFlagsOn = {
  enablePreferences: true,
  enableProperties: true,
  enableAgencies: true,
  enableTranslations: true,
}

const visibleFor = (userRoles: UserRole) =>
  Object.entries(getVisibleSettingsTabs(allFlagsOn, userRoles))
    .filter(([, visible]) => visible)
    .map(([tab]) => tab)

describe("getVisibleSettingsTabs", () => {
  // Each tab is shown only to the roles its page lets in, so no tab links to /unauthorized.
  it("shows every tab to an admin", () => {
    expect(visibleFor({ isAdmin: true })).toEqual([
      "preferences",
      "properties",
      "agencies",
      "translations",
    ])
  })

  it("hides translations from a jurisdictional admin, who cannot open that page", () => {
    expect(visibleFor({ isJurisdictionalAdmin: true })).toEqual([
      "preferences",
      "properties",
      "agencies",
    ])
  })

  it("hides properties, agencies and translations from a limited jurisdictional admin", () => {
    expect(visibleFor({ isLimitedJurisdictionalAdmin: true })).toEqual(["preferences"])
  })

  it("hides every tab from a partner", () => {
    expect(visibleFor({ isPartner: true })).toEqual([])
  })

  it("hides every tab from a support admin", () => {
    expect(visibleFor({ isSupportAdmin: true })).toEqual([])
  })

  it("keeps a tab hidden when its feature flag is off, whatever the role", () => {
    expect(
      getVisibleSettingsTabs({ ...allFlagsOn, enableTranslations: false }, { isAdmin: true })
        .translations
    ).toBe(false)
  })

  it("hides translations when the roles are not loaded yet", () => {
    expect(getVisibleSettingsTabs(allFlagsOn, undefined).translations).toBe(false)
  })
})

describe("getEnabledSettingsTabCount", () => {
  it("counts only the tabs the role can open", () => {
    expect(getEnabledSettingsTabCount(allFlagsOn, { isAdmin: true })).toBe(4)
    expect(getEnabledSettingsTabCount(allFlagsOn, { isLimitedJurisdictionalAdmin: true })).toBe(1)
  })

  it("counts zero for a role with no settings pages, which hides the tab bar", () => {
    expect(getEnabledSettingsTabCount(allFlagsOn, { isPartner: true })).toBe(0)
  })
})
