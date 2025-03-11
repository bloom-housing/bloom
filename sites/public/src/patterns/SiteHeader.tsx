import React from "react"
import ChevronDown from "@heroicons/react/20/solid/ChevronDownIcon"
import { Heading, Icon, Link } from "@bloom-housing/ui-seeds"
import styles from "./SiteHeader.module.scss"

export interface HeaderLink {
  label: string
  href?: string
  onClick?: () => void
  subMenuLinks?: HeaderLink[]
}

interface HeaderLinkProps {
  link: HeaderLink
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

const HeaderLink = (props: HeaderLinkProps) => {
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
  languages: Language[]
  links: HeaderLink[]
  message?: React.ReactNode
  titleLink: string
  logo?: React.ReactNode
  logoClassName?: string
}

export const SiteHeader = (props: SiteHeaderProps) => {
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
              <Heading size={"xl"}>{props.title}</Heading>
            </div>
          </Link>
          <ul className={styles["links-container"]}>
            {props.links?.map((link, index) => {
              return <HeaderLink link={link} key={index} />
            })}
          </ul>
        </div>
      </HeadingWrapper>
    </nav>
  )
}
