import * as React from 'react'
import Link from "next/link"

const SiteHeader = (props: any) => {
  const Logo = () => (
    <div className="max-w-5xl m-auto">
      <div className="float-left bg-white">
        <Link href="/">
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
      <div className="max-w-5xl m-auto">
        {props.notice}
      </div>
    </div>
  )

  const NavBar = () => (
    <div className="h-20 text-right">
      <nav className="max-w-5xl m-auto">
        <Link href="/listings">
          <a>Listings</a>
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
