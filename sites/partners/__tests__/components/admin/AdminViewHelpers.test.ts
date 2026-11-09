import {
  AdminIndexEnum,
  adminPath,
  getVisibleAdminTabs,
} from "../../../src/components/admin/AdminViewHelpers"

const superAdmin = { isAdmin: true, isSuperAdmin: true }

describe("getVisibleAdminTabs", () => {
  it("shows every tab to a superadmin when both flags are on", () => {
    expect(getVisibleAdminTabs({ enableContent: true, enableBranding: true }, superAdmin)).toEqual([
      AdminIndexEnum.featureFlags,
      AdminIndexEnum.translations,
      AdminIndexEnum.content,
      AdminIndexEnum.branding,
      AdminIndexEnum.transfer,
    ])
  })

  it("shows translations, content and export and import for the content flag alone", () => {
    expect(getVisibleAdminTabs({ enableContent: true }, superAdmin)).toEqual([
      AdminIndexEnum.featureFlags,
      AdminIndexEnum.translations,
      AdminIndexEnum.content,
      AdminIndexEnum.transfer,
    ])
  })

  it("shows branding and export and import for the branding flag alone", () => {
    expect(getVisibleAdminTabs({ enableBranding: true }, superAdmin)).toEqual([
      AdminIndexEnum.featureFlags,
      AdminIndexEnum.branding,
      AdminIndexEnum.transfer,
    ])
  })

  it("always shows feature flags to a superadmin", () => {
    expect(getVisibleAdminTabs({}, superAdmin)).toEqual([AdminIndexEnum.featureFlags])
  })

  it.each([
    ["an admin who is not a superadmin", { isAdmin: true }],
    ["a jurisdictional admin", { isJurisdictionalAdmin: true }],
    ["a user whose roles are not loaded yet", undefined],
  ])("shows no tab to %s", (_label, userRoles) => {
    expect(getVisibleAdminTabs({ enableContent: true, enableBranding: true }, userRoles)).toEqual(
      []
    )
  })
})

describe("adminPath", () => {
  it("names each tab's page", () => {
    expect(adminPath(AdminIndexEnum.transfer)).toEqual("/admin/transfer")
    expect(adminPath(AdminIndexEnum.featureFlags)).toEqual("/admin/feature-flags")
  })
})
