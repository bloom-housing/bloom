import * as React from "react"
import { NavigationContext } from "../config/NavigationContext"
import "./SideNav.scss"

export interface SideNavItemProps {
  current?: boolean
  url: string
  label: string
}

export interface SideNavProps {
  navItems?: SideNavItemProps[]
}

const SideNav = (props: SideNavProps) => {
  const { LinkComponent } = React.useContext(NavigationContext)

  return (
    <nav className="side-nav" aria-label="Secondary navigation">
      <ul>
        {props.navItems?.map((navItem: SideNavItemProps, index: number) => {
          return (
            <li key={index}>
              <LinkComponent
                className={navItem.current ? "is-current" : undefined}
                href={navItem.url}
                aria-current={navItem.current ? "page" : undefined}
              >
                {navItem.label}
              </LinkComponent>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
export { SideNav as default, SideNav }
