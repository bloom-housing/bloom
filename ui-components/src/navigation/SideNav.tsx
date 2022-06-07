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
          if (navItem.current) {
            return (
              <li className="is-current" key={index} aria-selected>
                {navItem.label}
              </li>
            )
          }
          return (
            <li key={index}>
              <LinkComponent href={navItem.url}>{navItem.label}</LinkComponent>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
export { SideNav as default, SideNav }
