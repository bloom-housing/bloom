import * as React from "react"
import t from "../helpers/translator"
import LocalizedLink from "../atoms/LocalizedLink"

interface SiteHeaderProps {
  logoSrc: string
  title: string
  notice: string
}

const SiteHeader = (props: SiteHeaderProps) => {
  const Logo = () => (
    <div className="max-w-5xl m-auto">
      <div className="float-left bg-white">
        <LocalizedLink href="/">
          <img src={props.logoSrc} />
          <span className="">{props.title}</span>
        </LocalizedLink>
      </div>
    </div>
  )

  const TopBar = () => (
    <div className="w-full h-8 bg-blue-600 text-right text-white">
      <div className="max-w-5xl m-auto">{props.notice}</div>
    </div>
  )

  const NavBar = () => (
    <div className="h-20 text-right">
      <nav className="max-w-5xl m-auto">
        <LocalizedLink href="/listings">{t("nav.listings")}</LocalizedLink>
      </nav>
    </div>
  )

  return (
    <header className="w-full border-b-1 border-gray-400">
      <Logo />
      <TopBar />
      <NavBar />
    </header>
  )
}

export default SiteHeader
