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
    title="Alameda County Housing Portal"
    skip="Skip to content"
  >
    <a href="#" className="navbar-item">
      Hello World
    </a>
  </SiteHeader>
)

export const standardSlim = () => (
  <SiteHeader
    logoSrc="/images/logo_glyph.svg"
    notice="This is a preview of our new website. We're just getting started. We'd love to get your feedback."
    title="Housing Portal"
    skip="Skip to content"
    logoWidth={"slim"}
  >
    <a href="#" className="navbar-item">
      Hello World
    </a>
  </SiteHeader>
)

export const standardMedium = () => (
  <SiteHeader
    logoSrc="/images/logo_glyph.svg"
    notice="This is a preview of our new website. We're just getting started. We'd love to get your feedback."
    title="Alameda County Housing Portal"
    skip="Skip to content"
    logoWidth={"medium"}
  >
    <a href="#" className="navbar-item">
      Hello World
    </a>
  </SiteHeader>
)

export const standardWide = () => (
  <SiteHeader
    logoSrc="/images/logo_glyph.svg"
    notice="This is a preview of our new website. We're just getting started. We'd love to get your feedback."
    title="Dahlia San Francisco Housing Portal"
    skip="Skip to content"
    logoWidth={"wide"}
  >
    <a href="#" className="navbar-item">
      Hello World
    </a>
  </SiteHeader>
)

export const imageOnlySlim = () => (
  <SiteHeader
    logoSrc="/images/listing.jpg"
    imageOnly={true}
    title={"Image Alt Text"}
    notice="This is a preview of our new website. We're just getting started. We'd love to get your feedback."
    skip="Skip to content"
    logoWidth={"slim"}
  >
    <a href="#" className="navbar-item">
      Hello World
    </a>
  </SiteHeader>
)

export const imageOnlyMedium = () => (
  <SiteHeader
    logoSrc="/images/listing.jpg"
    imageOnly={true}
    title={"Image Alt Text"}
    notice="This is a preview of our new website. We're just getting started. We'd love to get your feedback."
    skip="Skip to content"
    logoWidth={"medium"}
  >
    <a href="#" className="navbar-item">
      Hello World
    </a>
  </SiteHeader>
)

export const imageOnlyWide = () => (
  <SiteHeader
    logoSrc="/images/listing.jpg"
    imageOnly={true}
    title={"Image Alt Text"}
    notice="This is a preview of our new website. We're just getting started. We'd love to get your feedback."
    skip="Skip to content"
    logoWidth={"wide"}
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
    title="Alameda County Housing Portal"
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

export const withLanguageNavigation = () => (
  <SiteHeader
    logoSrc="/images/logo_glyph.svg"
    notice="This is a preview of our new website. We're just getting started. We'd love to get your feedback."
    title="Alameda County Housing Portal"
    skip="Skip to content"
    language={{
      list: [
        {
          prefix: "",
          label: "English",
        },
        {
          prefix: "es",
          label: "Spanish",
        },
      ],
      codes: [],
    }}
  >
    <a href="#" className="navbar-item">
      Hello World
    </a>
  </SiteHeader>
)
