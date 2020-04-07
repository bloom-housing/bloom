import * as React from "react"
import { withA11y } from "@storybook/addon-a11y"
import SiteHeader, { NavbarDropdown } from "./SiteHeader"
import Button from "../../atoms/Button"

export default {
  title: "Headers|SiteHeader",
  decorators: [withA11y],
}

export const standard = () => (
  <SiteHeader
    logoSrc="/images/logo_glyph.svg"
    notice="This is a preview of our new website. We're just getting started. We'd love to get your feedback."
    title="Site Title Here"
  >
    <a href="#" className="navbar-item">
      Hello World
    </a>
  </SiteHeader>
)

export const withDropdownAndButton = () => (
  <SiteHeader
    logoSrc="/images/logo_glyph.svg"
    notice="This is a preview of our new website. We're just getting started. We'd love to get your feedback."
    title="Site Title Here"
  >
    <a href="#" className="navbar-item">
      Hello World
    </a>
    <NavbarDropdown menuTitle="Testing Menu">
      <a href="#" className="navbar-item">
        My Favorites
      </a>
      <a href="#" className="navbar-item">
        Get Assistance
      </a>
      <hr className="navbar-divider" />
      <a href="#" className="navbar-item">
        Sign In
      </a>
    </NavbarDropdown>
    <div className="navbar-item">
      <div className="buttons">
        <Button
          small={true}
          onClick={() => {
            alert("Hello!")
          }}
        >
          Example Button
        </Button>
      </div>
    </div>
  </SiteHeader>
)
