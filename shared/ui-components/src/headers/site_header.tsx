import * as React from "react"
import t from "../helpers/translator"
import LocalizedLink from "../atoms/LocalizedLink"

interface SiteHeaderProps {
  logoSrc: string
  title: string
  notice: string
}

class SiteHeader extends React.Component<SiteHeaderProps, {}> {
  constructor(props: SiteHeaderProps) {
    super(props)
    this.state = { active: false }
  }

  render() {
    const Logo = () => (
      <div className="max-w-5xl m-auto">
        <div className="float-left bg-white">
          <LocalizedLink href="/">
            <img src={this.props.logoSrc} />
            <span className="">{this.props.title}</span>
          </LocalizedLink>
        </div>
      </div>
    )

    const TopBar = () => (
      <div className="w-full h-8 bg-blue-600 text-right text-white">
        <div className="max-w-5xl m-auto">{this.props.notice}</div>
      </div>
    )

    const NavBar = () => (
      <div className="h-20 text-right">
        <nav className="max-w-5xl m-auto">
          <LocalizedLink href="/listings">{t("nav.listings")}</LocalizedLink>
        </nav>
      </div>
    )

    const handleMenuToggle = () => {
      this.setState((state, props) => ({
        active: !state.active
      }))
    }

    return (
      <>
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item" href="https://bulma.io">
              <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" />
            </a>

            <a
              role="button"
              className="navbar-burger burger"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
              onClick={handleMenuToggle}
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div
            id="navbarBasicExample"
            className={"navbar-menu" + (this.state.active ? " is-active" : "")}
          >
            <div className="navbar-start">
              <a className="navbar-item">Home</a>

              <a className="navbar-item">Documentation</a>

              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">More</a>

                <div className="navbar-dropdown">
                  <a className="navbar-item">About</a>
                  <a className="navbar-item">Jobs</a>
                  <a className="navbar-item">Contact</a>
                  <hr className="navbar-divider" />
                  <a className="navbar-item">Report an issue</a>
                </div>
              </div>
            </div>

            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  <a className="button is-primary">
                    <strong>Sign up</strong>
                  </a>
                  <a className="button is-light">Log in</a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <header className="w-full border-b-1 border-gray-400">
          <Logo />
          <TopBar />
          <NavBar />
        </header>
      </>
    )
  }
}

export default SiteHeader
