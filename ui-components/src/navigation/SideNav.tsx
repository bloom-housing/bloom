import * as React from "react"
import { NavigationContext } from "../config/NavigationContext"
import "./SideNav.scss"

export interface SideNavItemProps {
  current?: boolean
  url: string
  label: string
  count?: number
  childrenItems?: SideNavItemProps[]
}

export interface SideNavProps {
  className?: string
  navItems?: SideNavItemProps[]
}

const ItemLabel = ({ item }: { item: SideNavItemProps }) => {
  if (typeof item.count !== "undefined") {
    return (
      <>
        <span>{item.label}</span>
        <span className={"side-nav__count"}>{item.count}</span>
      </>
    )
  } else {
    return <>{item.label}</>
  }
}

const SideNav = (props: SideNavProps) => {
  const { LinkComponent } = React.useContext(NavigationContext)

  const classNames = ["side-nav"]
  if (props.className) classNames.push(props.className)

  return (
    <nav className={classNames.join(" ")} aria-label="Secondary navigation">
      <ul>
        {props.navItems?.map((navItem: SideNavItemProps, index: number) => {
          const hasCurrentChild = navItem.childrenItems?.some((item) => item.current)
          return (
            <li key={index}>
              <LinkComponent
                href={navItem.url}
                className={hasCurrentChild ? "has-current-child" : ""}
                aria-current={navItem.current ? "page" : undefined}
              >
                <ItemLabel item={navItem} />
              </LinkComponent>
              {navItem.childrenItems && (
                <ul>
                  {navItem.childrenItems.map((childItem, childIndex) => {
                    return (
                      <li key={childIndex}>
                        <LinkComponent
                          href={childItem.url}
                          aria-current={childItem.current ? "page" : undefined}
                        >
                          <ItemLabel item={childItem} />
                        </LinkComponent>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
export { SideNav as default, SideNav }
