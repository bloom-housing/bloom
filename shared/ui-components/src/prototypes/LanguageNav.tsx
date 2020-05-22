import * as React from "react"
import "./LanguageNav.scss"

export interface LanguageNavProps {
  children: React.ReactNode[]
}

const LanguageNav = (props: LanguageNavProps) => (
  <div className="language-bar">
    <div className="language-bar__inner">
      <nav className="language-nav">
        <ul className="language-nav__list">{props.children}</ul>
      </nav>
    </div>
  </div>
)

export { LanguageNav as default, LanguageNav }
