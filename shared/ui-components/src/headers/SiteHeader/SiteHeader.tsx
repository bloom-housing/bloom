import * as React from "react"
import LocalizedLink from "../../atoms/LocalizedLink"

interface SiteHeaderProps {
  logoSrc: string
  title: string
  notice: string | React.ReactNode
  children: React.ReactNode
}

interface SiteHeaderState {
  active: boolean
}

interface NavbarDropdownProps {
  menuTitle: string
  children: React.ReactNode
}

export const NavbarDropdown = (props: NavbarDropdownProps) => {
  return (
    <div className="navbar-item has-dropdown is-hoverable">
      <a className="navbar-link">{props.menuTitle}</a>

      <div className="navbar-dropdown">{props.children}</div>
    </div>
  )
}

class SiteHeader extends React.Component<SiteHeaderProps, SiteHeaderState> {
  constructor(props: SiteHeaderProps) {
    super(props)
    this.state = { active: false }
    this.handleMenuToggle = this.handleMenuToggle.bind(this)
  }

  noticeBar() {
    return (
      <div className="navbar-notice">
        <div className="navbar-notice__text">{this.props.notice}</div>
      </div>
    )
  }

  logo() {
    return (
      <LocalizedLink className="navbar-item logo" href="/">
        <div className="logo__lockup">
          <img className="logo__image" src={this.props.logoSrc} />
          <div className="logo__title">{this.props.title}</div>
        </div>
      </LocalizedLink>
    )
  }

  handleMenuToggle = () => {
    this.setState({ active: !this.state.active })
  }

  hamburgerMenu() {
    return (
      <a
        role="button"
        className={"navbar-burger burger" + (this.state.active ? " is-active" : "")}
        aria-label="menu"
        aria-expanded={this.state.active ? "true" : "false"}
        data-target="navbarMenuLinks"
        onClick={this.handleMenuToggle}
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    )
  }

  render() {
    return (
      <>
        {this.noticeBar()}

        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            {this.logo()}
            {this.hamburgerMenu()}
          </div>

          <div
            id="navbarMenuLinks"
            className={"navbar-menu mt-3 md:mt-0" + (this.state.active ? " is-active" : "")}
          >
            <div className="navbar-end">{this.props.children}</div>
          </div>
        </nav>
      </>
    )
  }
}

export default SiteHeader
