import * as React from "react"
import { storiesOf } from "@storybook/react"
import SiteHeader, { NavbarDropdown } from "./SiteHeader"
import Button from "../../atoms/Button"

storiesOf("Headers|SiteHeader", module).add("standard", () => (
  <SiteHeader
    logoSrc="/images/logo_glyph.svg"
    notice="This is a preview of our new website. We're just getting started. We'd love to get your feedback."
    title="Site Title Here"
  >
    <a href="#" className="navbar-item">
      Hello World
    </a>
  </SiteHeader>
))

storiesOf("Headers|SiteHeader", module).add("with dropdown and button", () => (
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
))
