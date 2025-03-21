import React, { useEffect, useState } from "react"
import ChevronDown from "@heroicons/react/20/solid/ChevronDownIcon"
import MenuIcon from "@heroicons/react/20/solid/Bars3Icon"
import { Button, Heading, Icon, Link } from "@bloom-housing/ui-seeds"
import styles from "./SiteHeader.module.scss"
import { t } from "@bloom-housing/ui-components"

export interface HeaderLink {
  label: string
  href?: string
  onClick?: () => void
  subMenuLinks?: HeaderLink[]
}

interface HeaderLinkProps {
  link: HeaderLink
  openSubMenus: string[]
}

// export interface MenuLink {
//   className?: string
//   href?: string
//   iconClassName?: string
//   iconElement?: React.ReactNode
//   iconSrc?: string
//   onClick?: () => void
//   subMenuLinks?: MenuLink[]
//   title: string
// }

const DesktopHeaderLink = (props: HeaderLinkProps) => {
  if (props.link.subMenuLinks?.length) {
    // Dropdown
    return (
      <li className={styles["dropdown-link-container"]}>
        <button className={styles["link"]} onClick={props.link.onClick}>
          {props.link.label}
          <Icon size={"md"} className={styles["dropdown-icon"]}>
            <ChevronDown />
          </Icon>
        </button>
        <ul className={styles["submenu-container"]}>
          {props.link.subMenuLinks.map((subMenuLink, index) => {
            if (subMenuLink.href) {
              return (
                <li className={styles["submenu-item"]} key={index}>
                  <Link className={styles["submenu-link"]} href={subMenuLink.href}>
                    {subMenuLink.label}
                  </Link>
                </li>
              )
            } else {
              return (
                <li className={styles["submenu-item"]} key={index}>
                  <button className={styles["submenu-link"]} onClick={subMenuLink.onClick}>
                    {subMenuLink.label}
                  </button>
                </li>
              )
            }
          })}
        </ul>
      </li>
    )
  } else {
    // Single link
    if (props.link.href) {
      return (
        <li>
          <Link className={styles["link"]} href={props.link.href}>
            {props.link.label}
          </Link>
        </li>
      )
    } else {
      return (
        <li>
          <button className={styles["link"]} onClick={props.link.onClick}>
            {props.link.label}
          </button>
        </li>
      )
    }
  }
}

const MobileHeaderLink = (props: HeaderLinkProps) => {
  const openSubMenu = props.openSubMenus.indexOf(props.link.label) >= 0
  if (props.link.subMenuLinks?.length) {
    // Dropdown
    return (
      <li className={styles["mobile-dropdown-link-container"]}>
        <button
          className={`${styles["mobile-link"]} ${
            openSubMenu ? styles["show-submenu-button"] : styles["hide-submenu-button"]
          }`}
          onClick={props.link.onClick}
        >
          {props.link.label}
          <Icon size={"md"} className={styles["dropdown-icon"]}>
            <ChevronDown />
          </Icon>
        </button>
        <ul
          className={`${styles["mobile-submenu-container"]} ${
            openSubMenu ? styles["show-submenu"] : styles["hide-submenu"]
          }`}
        >
          {props.link.subMenuLinks.map((subMenuLink, index) => {
            if (subMenuLink.href) {
              return (
                <li className={styles["mobile-submenu-item"]} key={index}>
                  <Link className={styles["mobile-submenu-link"]} href={subMenuLink.href}>
                    {subMenuLink.label}
                  </Link>
                </li>
              )
            } else {
              return (
                <li className={styles["mobile-submenu-item"]} key={index}>
                  <button className={styles["mobile-submenu-link"]} onClick={subMenuLink.onClick}>
                    {subMenuLink.label}
                  </button>
                </li>
              )
            }
          })}
        </ul>
      </li>
    )
  } else {
    // Single link
    if (props.link.href) {
      return (
        <li>
          <Link className={styles["mobile-link"]} href={props.link.href}>
            {props.link.label}
          </Link>
        </li>
      )
    } else {
      return (
        <li>
          <button className={styles["mobile-link"]} onClick={props.link.onClick}>
            {props.link.label}
          </button>
        </li>
      )
    }
  }
}

interface LanguageButtonProps {
  label: string
  active: boolean
  onClick: () => void
}

const LanguageButton = (props: LanguageButtonProps) => {
  return (
    <button
      className={`${styles["language"]} ${props.active ? styles["active-language"] : ""}`}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  )
}

interface HeadingWrapperProps {
  children: React.ReactNode
  className?: string
}

const HeadingWrapper = (props: HeadingWrapperProps) => {
  return (
    <div className={`${styles["header-container"]} ${props.className ? props.className : ""}`}>
      <div className={styles["header-wrapper"]}>
        <div className={styles["content"]}>{props.children}</div>
      </div>
    </div>
  )
}

export type Language = {
  label: string
  onClick: () => void
  active: boolean
}

interface SiteHeaderProps {
  title: string
  subtitle?: string
  languages: Language[]
  links: HeaderLink[]
  message?: React.ReactNode
  titleLink: string
  logo?: React.ReactNode
  logoClassName?: string
}

export const SiteHeader = (props: SiteHeaderProps) => {
  const [linksWrapping, setLinksWrapping] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSubMenus, setOpenSubMenus] = useState([])

  // Detects if element has wrapped onto the next line
  useEffect(() => {
    const handler = () => {
      const element = document.getElementById("links-container-desktop")
      if (element.offsetTop > 60) {
        setLinksWrapping(true)
      } else {
        setLinksWrapping(false)
      }
      setOpenSubMenus([])
      setMobileMenuOpen(false)
    }

    window.addEventListener("resize", handler)

    return () => {
      window.removeEventListener("resize", handler)
    }
  }, [])

  return (
    <nav className={styles["site-header-container"]} aria-label={"Main"}>
      <HeadingWrapper className={styles["language-wrapper"]}>
        <div className={styles["language-container"]}>
          {props.languages?.map((language, index) => {
            return (
              <LanguageButton
                label={language.label}
                onClick={language.onClick}
                active={language.active}
                key={index}
              />
            )
          })}
        </div>
      </HeadingWrapper>
      <HeadingWrapper className={styles["message-wrapper"]}>
        <div className={styles["message-container"]}>{props.message ?? ""}</div>
      </HeadingWrapper>
      <HeadingWrapper className={styles["navigation-wrapper"]}>
        <div className={styles["navigation-container"]}>
          <Link className={styles["title-container"]} href={props.titleLink}>
            {props.logo && (
              <div
                className={`${styles["logo"]} ${props.logoClassName ? props.logoClassName : ""}`}
              >
                {props.logo}
              </div>
            )}
            <div className={styles["title"]}>
              <Heading size={"xl"} className={styles["title-heading"]}>
                {props.title}
              </Heading>
              {props.subtitle && <p className={styles["title-subheading"]}>{props.subtitle}</p>}
            </div>
          </Link>
          <ul
            className={`${styles["links-container-desktop"]} ${
              linksWrapping ? styles["links-container-wrapping"] : ""
            }`}
            id={"links-container-desktop"}
          >
            {props.links?.map((link, index) => {
              return <DesktopHeaderLink link={link} key={index} openSubMenus={openSubMenus} />
            })}
          </ul>
          <div
            className={`${styles["links-container-mobile"]} ${
              linksWrapping ? styles["links-container-wrapping"] : ""
            }`}
          >
            <Button
              variant={"primary-outlined"}
              className={styles["menu-button"]}
              size={"sm"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              tailIcon={
                <Icon>
                  <MenuIcon />
                </Icon>
              }
            >
              {t("t.menu")}
            </Button>
          </div>
        </div>
      </HeadingWrapper>
      {mobileMenuOpen && (
        <div className={styles["mobile-submenu-container"]}>
          <ul>
            {props.links?.map((link, index) => {
              if (link.subMenuLinks)
                link.onClick = () => {
                  setOpenSubMenus(
                    openSubMenus.indexOf(link.label) >= 0
                      ? openSubMenus.filter((menu) => menu !== link.label)
                      : [...openSubMenus, link.label]
                  )
                }
              return <MobileHeaderLink link={link} key={index} openSubMenus={openSubMenus} />
            })}
          </ul>
        </div>
      )}
    </nav>
  )
}
