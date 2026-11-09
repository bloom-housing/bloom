import React from "react"
import { screen } from "@testing-library/react"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter, render } from "../testUtils"
import Layout from "../../src/layouts"

const renderLayout = (userRoles: Record<string, boolean>) => {
  mockNextRouter()
  render(
    <MessageContext.Provider value={{ toastMessagesRef: { current: [] }, addToast: jest.fn() }}>
      <AuthContext.Provider
        value={{
          profile: { ...user, userRoles, jurisdictions: [] },
          doJurisdictionsHaveFeatureFlagOn: () => false,
        }}
      >
        <Layout>page</Layout>
      </AuthContext.Provider>
    </MessageContext.Provider>
  )
}

describe("layout", () => {
  it("links to Admin for a superadmin", () => {
    renderLayout({ isAdmin: true, isSuperAdmin: true })

    expect(screen.getAllByRole("link", { name: "Admin" })[0]).toHaveAttribute("href", "/admin")
  })

  it("has no Admin link for an admin who is not a superadmin", () => {
    renderLayout({ isAdmin: true })

    expect(screen.queryByRole("link", { name: "Admin" })).not.toBeInTheDocument()
  })
})
