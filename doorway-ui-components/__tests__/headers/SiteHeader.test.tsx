import React from "react"
import { render, cleanup } from "@testing-library/react"
import { SiteHeader } from "../../src/headers/SiteHeader"

afterEach(cleanup)

describe("<SiteHeader>", () => {
  it("renders default state", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <SiteHeader
        homeURL={"/"}
        languageNavLabel="Choose a language"
        languages={[
          { label: "English", onClick: () => console.log("Clicked English"), active: true },
          { label: "Español", onClick: () => console.log("Clicked Español"), active: false },
          { label: "中文", onClick: () => console.log("Clicked 中文"), active: false },
        ]}
        notice="We're just getting started. We'd love to get your feedback."
        logoSrc="/images/logo_glyph.svg"
        title="Site Title"
        menuLinks={[
          {
            title: "Listings",
            href: "/",
          },
          {
            title: "Get Assistance",
            href: "/",
          },
          {
            title: "My Account",
            subMenuLinks: [
              {
                title: "My Dashboard",
                href: "/account/dashboard",
              },
              {
                title: "My Applications",
                href: "/account/dashboard",
              },
              {
                title: "Account Settings",
                href: "/account/edit",
              },
              {
                title: "Sign Out",
                onClick: jest.fn(),
              },
            ],
          },
        ]}
      />
    )
    expect(getByText("We're just getting started. We'd love to get your feedback.")).toBeTruthy()
    expect(getByText("Listings")).toBeTruthy()
    expect(getByText("Get Assistance")).toBeTruthy()
    expect(getByText("Account")).toBeTruthy()
    expect(queryByText("My Dashboard")).toBeNull()
    expect(queryByText("My Applications")).toBeNull()
    expect(queryByText("Account Settings")).toBeNull()
    expect(queryByText("Sign Out")).toBeNull()
    expect(getByText("Site Title")).toBeTruthy()
    expect(getByText("English")).toBeTruthy()
    expect(getByText("中文")).toBeTruthy()
    expect(getByText("Español")).toBeTruthy()
    expect(getByLabelText("Choose a language")).toBeTruthy()
  })
})
