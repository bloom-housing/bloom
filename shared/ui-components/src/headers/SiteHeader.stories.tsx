import * as React from "react"

import { SiteHeader, NavbarDropdown } from "./SiteHeader"
import { Button } from "../actions/Button"
import { AppearanceSizeType } from "../global/AppearanceTypes"

export default {
  title: "Headers/Site Header",
}

export const standard = () => (
  <SiteHeader
    logoSrc="/images/logo_glyph.svg"
    notice="This is a preview of our new website. We're just getting started. We'd love to get your feedback."
    title="Site Title Here"
    skip="Skip to content"
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
    skip="Skip to content"
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
      <a href="#" className="navbar-item">
        Sign In
      </a>
    </NavbarDropdown>
    <div className="navbar-item">
      <div className="buttons">
        <Button
          size={AppearanceSizeType.small}
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
