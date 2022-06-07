import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { SideNav } from "../../src/navigation/SideNav"

afterEach(cleanup)

describe("<SideNav>", () => {
  it("renders default state", () => {
    const { getByText } = render(
      <SideNav
        navItems={[
          {
            url: "/One",
            label: "NavItem 1",
            current: false,
          },
          { url: "/Two", label: "NavItem 2", current: false },
          { url: "/Three", label: "NavItem 3", current: false },
        ]}
      />
    )

    expect(getByText("NavItem 1")).toBeTruthy()
    expect(getByText("NavItem 2")).toBeTruthy()
    expect(getByText("NavItem 3")).toBeTruthy()
    expect(getByText("NavItem 1").closest("a")?.getAttribute("href")).toBe("/One")
    expect(getByText("NavItem 2").closest("a")?.getAttribute("href")).toBe("/Two")
    expect(getByText("NavItem 3").closest("a")?.getAttribute("href")).toBe("/Three")
  })

  it("does not render anchor tag with only current = true nav item", () => {
    const { queryByText } = render(
      <SideNav
        navItems={[
          {
            url: "/One",
            label: "NavItem 1",
            current: true,
          },
        ]}
      />
    )

    const anchorTag = queryByText("NavItem 1")?.closest("a")
    expect(anchorTag).not.toBeInTheDocument()
  })
})
