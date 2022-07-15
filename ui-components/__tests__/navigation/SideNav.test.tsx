import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { SideNav } from "../../src/navigation/SideNav"

afterEach(cleanup)

const navItems = [
  {
    url: "/One",
    label: "NavItem 1",
    current: false,
  },
  { url: "/Two", label: "NavItem 2", current: false },
  { url: "/Three", label: "NavItem 3", current: false },
]

describe("<SideNav>", () => {
  it("renders default state", () => {
    const { getByText } = render(<SideNav navItems={navItems} />)

    expect(getByText("NavItem 1")).toBeTruthy()
    expect(getByText("NavItem 2")).toBeTruthy()
    expect(getByText("NavItem 3")).toBeTruthy()
    expect(getByText("NavItem 1").closest("a")?.getAttribute("href")).toBe("/One")
    expect(getByText("NavItem 2").closest("a")?.getAttribute("href")).toBe("/Two")
    expect(getByText("NavItem 3").closest("a")?.getAttribute("href")).toBe("/Three")
  })

  it("renders with current state", () => {
    const { getByText, container } = render(
      <SideNav navItems={[...navItems, { url: "/Four", label: "NavItem 4", current: true }]} />
    )

    expect(container.querySelectorAll("a[aria-current]").length).toEqual(1)
    expect(getByText("NavItem 4").closest("a")?.getAttribute("aria-current")).toEqual("page")
  })
})
