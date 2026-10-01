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
  it("opens the first tab a superadmin can see", async () => {
    const replaceMock = renderAdmin({ isAdmin: true, isSuperAdmin: true }, [
      FeatureFlagEnum.enableDbDrivenContent,
    ])

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/admin/translations"))
  })

  it("opens feature flags when no database content or branding is on", async () => {
    const replaceMock = renderAdmin({ isAdmin: true, isSuperAdmin: true }, [])

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/admin/feature-flags"))
  })

  it("sends an admin who is not a superadmin to unauthorized", async () => {
    const replaceMock = renderAdmin({ isAdmin: true }, [FeatureFlagEnum.enableDbDrivenContent])

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/unauthorized"))
  })
})
