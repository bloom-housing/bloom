import React, { useState } from "react"
import { LocalizedLink } from "../actions/LocalizedLink"
import { LanguageNav, LangItem } from "../navigation/LanguageNav"

export interface SiteHeaderLanguage {
  list: LangItem[]
  codes: string[]
}
type LogoWidth = "slim" | "medium" | "wide"

export interface SiteHeaderProps {
  logoSrc: string
  title: string
  imageOnly?: boolean
  skip: string
  notice: string | React.ReactNode
  children: React.ReactNode
  language?: SiteHeaderLanguage
  logoClass?: string
  logoWidth?: LogoWidth
}

export interface SiteHeaderState {
  active: boolean
}

export interface NavbarDropdownProps {
  menuTitle: string
  children: React.ReactNode
}

export const NavbarDropdown = (props: NavbarDropdownProps) => {
  return (
    <div className="navbar-item has-dropdown is-hoverable" tabIndex={0}>
      <a className="navbar-link">{props.menuTitle}</a>
      <div className="navbar-dropdown">{props.children}</div>
    </div>
  )
}

const SiteHeader = (props: SiteHeaderProps) => {
  const [active, setActive] = useState(false)

  const skipLink = () => {
    return (
      <a href="#main-content" className="navbar__skip-link">
        {props.skip}
      </a>
    )
  }

  const noticeBar = () => {
    return (
      <div className="navbar-notice">
        <div className="navbar-notice__text">{props.notice}</div>
      </div>
    )
  }

  const getLogoWidthClass = () => {
    if (props.logoWidth === "slim") return "navbar-width-slim"
    if (props.logoWidth === "medium") return "navbar-width-med"
    if (props.logoWidth === "wide") return "navbar-width-wide"
    return ""
  }

  const logo = (logoClass = "") => {
    return (
      <LocalizedLink
        className={`navbar-item logo ${logoClass} ${getLogoWidthClass()}`}
        href="/"
        aria={{ "aria-label": "homepage" }}
      >
        <div
          className={`logo__lockup ${getLogoWidthClass()} ${
            props.logoWidth && "navbar-custom-width"
          } ${props.imageOnly && "navbar-image-only-container"}`}
        >
          <img
            className={`logo__image ${props.imageOnly && "navbar-image-only"}`}
            src={props.logoSrc}
            alt={props.title}
          />
          {!props.imageOnly && <div className="logo__title">{props.title}</div>}
        </div>
      </LocalizedLink>
    )
  }

  const handleMenuToggle = () => {
    setActive(!active)
  }

  const hamburgerMenu = () => {
    return (
      <a
        role="button"
        className={"navbar-burger burger" + (active ? " is-active" : "")}
        aria-label="menu"
        aria-expanded={active ? "true" : "false"}
        data-target="navbarMenuLinks"
        onClick={handleMenuToggle}
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    )
  }

  return (
    <>
      {props.language && <LanguageNav language={props.language} />}

      {skipLink()}
      {noticeBar()}
      <div className="navbar__wrapper">
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            {logo(props.logoClass)}
            {hamburgerMenu()}
          </div>

          <div
            id="navbarMenuLinks"
            className={"navbar-menu md:mt-0" + (active ? " is-active" : "")}
          >
            <div className="navbar-end">{props.children}</div>
          </div>
        </nav>
      </div>
    </>
  )
}

export { SiteHeader as default, SiteHeader }
