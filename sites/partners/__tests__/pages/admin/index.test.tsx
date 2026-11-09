import React from "react"
import { waitFor } from "@testing-library/react"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter, render } from "../../testUtils"
import Admin from "../../../src/pages/admin"

const renderAdmin = (userRoles: Record<string, boolean>, flags: string[]) => {
  const replaceMock = jest.fn()
  mockNextRouter(undefined, { replace: replaceMock })
  render(
    <AuthContext.Provider
      value={{
        profile: { ...user, userRoles },
        doJurisdictionsHaveFeatureFlagOn: (flag) => flags.includes(flag),
      }}
    >
      <Admin />
    </AuthContext.Provider>
  )
  return replaceMock
}

describe("admin", () => {
  it.each([
    ["no database content or branding", []],
    ["database content on", [FeatureFlagEnum.enableDbDrivenContent]],
  ])("opens feature flags for a superadmin with %s", async (_label, flags) => {
    const replaceMock = renderAdmin({ isAdmin: true, isSuperAdmin: true }, flags)

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/admin/feature-flags"))
  })

  it("sends an admin who is not a superadmin to unauthorized", async () => {
    const replaceMock = renderAdmin({ isAdmin: true }, [FeatureFlagEnum.enableDbDrivenContent])

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/unauthorized"))
  })
})
