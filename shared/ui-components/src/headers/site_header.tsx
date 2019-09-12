import * as React from "react"
import t from "../helpers/translator"
import lRoute from "../helpers/localeRoute"
import Link from "next/link"

interface SiteHeaderProps {
  logoSrc: string
  title: string
  notice: string
}

const SiteHeader = (props: SiteHeaderProps) => {
  const Logo = () => (
    <div className="max-w-5xl m-auto">
      <div className="float-left bg-white">
        <Link href={`${lRoute("/")}`}>
          <a>
            <img src={props.logoSrc} />
            <span className="">{props.title}</span>
          </a>
        </Link>
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
        <Link href={`${lRoute("/listings")}`}>
          <a>{t("NAV.LISTINGS")}</a>
        </Link>
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
