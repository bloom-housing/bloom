import * as React from "react"
import { LocalizedLink } from "../actions/LocalizedLink"
import { t } from "../helpers/translator"
import { NavbarDropdown } from "../headers/SiteHeader"

export interface UserNavProps {
  signedIn: boolean
  children: React.ReactNode
  signOut: () => void
}

const UserNav = (props: UserNavProps) => {
  const { signedIn, children, signOut } = props

  if (signedIn) {
    return (
      <>
        <NavbarDropdown menuTitle={t("nav.myAccount")}>
          {children}
          <a href="#" className="navbar-item" onClick={signOut}>
            {t("nav.signOut")}
          </a>
        </NavbarDropdown>
      </>
    )
  } else {
    return (
      <>
        <LocalizedLink className="navbar-item" href="/sign-in">
          {t("nav.signIn")}
        </LocalizedLink>
      </>
    )
  }
}

export { UserNav as default, UserNav }
