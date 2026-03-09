import React from "react"
import { render, screen, cleanup, waitFor, fireEvent, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SiteHeader, HeaderLink } from "../../src/patterns/SiteHeader"

afterEach(cleanup)

const baseLinks: HeaderLink[] = [{ label: "Listings", href: "/listings" }]
const baseProps = {
  title: "Bloom",
  titleLink: "/",
  links: baseLinks,
  languages: [],
}

describe("SiteHeader", () => {
  it("renders the title, subtitle, and logo", () => {
    render(<SiteHeader {...baseProps} subtitle="Subheading" logo={<span>Logo</span>} />)

    expect(screen.getByText("Bloom")).toBeInTheDocument()
    expect(screen.getByText("Subheading")).toBeInTheDocument()
    expect(screen.getByText("Logo")).toBeInTheDocument()
  })

  it("renders a skip link when mainContentId is provided", () => {
    render(<SiteHeader {...baseProps} mainContentId="main-content" />)

    const skipLink = screen.getByRole("link", { name: /skip/i })
    expect(skipLink).toHaveAttribute("href", "#main-content")
  })

  it("renders a message bar when enabled", () => {
    render(<SiteHeader {...baseProps} showMessageBar={true} message="Message content" />)

    expect(screen.getByText("Message content")).toBeInTheDocument()
  })

  it("renders language buttons when dropdown is disabled", () => {
    render(
      <SiteHeader
        {...baseProps}
        languages={[
          { label: "English", active: true, onClick: jest.fn() },
          { label: "Spanish", active: false, onClick: jest.fn() },
        ]}
      />
    )

    const english = screen.getByRole("button", { name: "English" })
    const spanish = screen.getByRole("button", { name: "Spanish" })

    expect(english).toBeInTheDocument()
    expect(spanish).toBeInTheDocument()
    expect(english).toHaveClass("active-language")
  })

  it("renders navigation links and submenu items", async () => {
    const user = userEvent.setup()
    render(
      <SiteHeader
        {...baseProps}
        links={[
          { label: "Listings", href: "/listings" },
          {
            label: "Account",
            submenuLinks: [
              { label: "Dashboard", href: "/account/dashboard" },
              { label: "Sign Out", onClick: jest.fn() },
            ],
          },
        ]}
      />
    )

    expect(screen.getByRole("link", { name: "Listings" })).toBeInTheDocument()

    const accountButton = screen.getByRole("button", { name: "Account" })
    expect(accountButton).toHaveAttribute("aria-expanded", "false")

    await user.click(accountButton)
    expect(accountButton).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign Out" })).toBeInTheDocument()
  })

  it("closes the submenu on escape", async () => {
    const user = userEvent.setup()
    render(
      <SiteHeader
        {...baseProps}
        links={[
          {
            label: "Account",
            submenuLinks: [{ label: "Dashboard", href: "/account/dashboard" }],
          },
        ]}
      />
    )

    const accountButton = screen.getByRole("button", { name: "Account" })
    await user.click(accountButton)

    const dashboardLink = screen.getByRole("link", { name: "Dashboard" })
    dashboardLink.focus()
    fireEvent.keyDown(dashboardLink, { key: "Escape" })

    await waitFor(() =>
      expect(screen.queryByRole("link", { name: "Dashboard" })).not.toBeInTheDocument()
    )
    expect(accountButton).toHaveAttribute("aria-expanded", "false")
  })

  it("closes open menus when clicking outside", async () => {
    const user = userEvent.setup()
    render(
      <SiteHeader
        {...baseProps}
        links={[
          {
            label: "Account",
            submenuLinks: [{ label: "Dashboard", href: "/account/dashboard" }],
          },
        ]}
        languages={[
          { label: "English", active: true, onClick: jest.fn() },
          { label: "Spanish", active: false, onClick: jest.fn() },
        ]}
        languageDropdown={true}
      />
    )

    const accountButton = screen.getByRole("button", { name: "Account" })
    await user.click(accountButton)
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument()

    fireEvent.click(document.body)

    await waitFor(() =>
      expect(screen.queryByRole("link", { name: "Dashboard" })).not.toBeInTheDocument()
    )

    const activeLanguageButton = screen.getByTestId("English")
    await user.click(activeLanguageButton)
    expect(screen.getByTestId("Spanish")).toBeInTheDocument()

    fireEvent.click(document.body)

    await waitFor(() => expect(screen.queryByTestId("Spanish")).not.toBeInTheDocument())
  })

  it("opens the mobile menu and renders links", async () => {
    const user = userEvent.setup()
    render(<SiteHeader {...baseProps} />)

    const menuButton = screen.getByRole("button", { name: "Menu" })
    await user.click(menuButton)

    const mobileMenu = screen.getByTestId("mobile-submenu-container")
    expect(mobileMenu).toBeInTheDocument()
    expect(within(mobileMenu).getByRole("link", { name: "Listings" })).toBeInTheDocument()
  })

  describe("language dropdown", () => {
    it("renders the active language and opens the desktop dropdown", async () => {
      const user = userEvent.setup()
      render(
        <SiteHeader
          {...baseProps}
          languages={[
            { label: "English", active: true, onClick: jest.fn() },
            { label: "Spanish", active: false, onClick: jest.fn() },
          ]}
          languageDropdown={true}
        />
      )

      const activeLanguageButton = screen.getByTestId("English")
      expect(activeLanguageButton).toBeInTheDocument()
      expect(screen.queryByTestId("Spanish")).not.toBeInTheDocument()

      await user.click(activeLanguageButton)
      expect(screen.getByTestId("Spanish")).toBeInTheDocument()
    })

    it("calls onClick and closes the desktop dropdown when a language is selected", async () => {
      const user = userEvent.setup()
      const onSpanish = jest.fn()

      render(
        <SiteHeader
          {...baseProps}
          languages={[
            { label: "English", active: true, onClick: jest.fn() },
            { label: "Spanish", active: false, onClick: onSpanish },
          ]}
          languageDropdown={true}
        />
      )

      const activeLanguageButton = screen.getByTestId("English")

      await user.click(activeLanguageButton)
      await user.click(screen.getByTestId("Spanish"))

      expect(onSpanish).toHaveBeenCalledTimes(1)
      await waitFor(() => expect(screen.queryByTestId("Spanish")).not.toBeInTheDocument())
    })

    it("toggles the mobile dropdown and selects a language", async () => {
      const user = userEvent.setup()
      const onSpanish = jest.fn()

      render(
        <SiteHeader
          {...baseProps}
          languages={[
            { label: "English", active: true, onClick: jest.fn() },
            { label: "Spanish", active: false, onClick: onSpanish },
          ]}
          languageDropdown={true}
        />
      )

      const mobileToggle = screen.getByTestId("mobile-language-dropdown-button")
      expect(mobileToggle).toBeInTheDocument()

      await user.click(mobileToggle as HTMLButtonElement)
      expect(screen.getByRole("button", { name: "Spanish" })).toBeInTheDocument()

      await user.click(screen.getByRole("button", { name: "Spanish" }))
      expect(onSpanish).toHaveBeenCalledTimes(1)
      await waitFor(() =>
        expect(screen.queryByRole("button", { name: "Spanish" })).not.toBeInTheDocument()
      )
    })
  })
})
