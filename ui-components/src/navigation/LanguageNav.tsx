import * as React from "react"
import "./LanguageNav.scss"

export type LangItem = {
  prefix: string
  label: string
}

export interface LanguageNavProps {
  items: LangItem[]
  onChangeLanguage: (selectedLanguage: LangItem) => void
  currentLanguagePrefix: string
}

const LanguageNav = ({ currentLanguagePrefix, items, onChangeLanguage }: LanguageNavProps) => (
  <div className="language-bar">
    <div className="language-bar__inner">
      <nav className="language-nav">
        <ul className="language-nav__list">
          {items?.map((item) => (
            <li
              key={item.prefix}
              onClick={() => onChangeLanguage(item)}
              className={currentLanguagePrefix === item.prefix ? "is-active" : ""}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </div>
)

export { LanguageNav as default, LanguageNav }
