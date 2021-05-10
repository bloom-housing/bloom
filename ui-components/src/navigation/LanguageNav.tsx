import * as React from "react"
import "./LanguageNav.scss"
import { t } from "../helpers/translator"
import { useLanguageChange } from "../helpers/useLanguageChange"

export type LangItem = {
  prefix: string
  label: string
}

export interface LanguageNavLang {
  list: LangItem[]
  codes: string[]
}

export interface LanguageNavProps {
  language: LanguageNavLang
}

const LanguageNav = ({ language }: LanguageNavProps) => {
  const routePrefix = t("config.routePrefix")
  const changeLanguage = useLanguageChange(language)

  return (
    <div className="language-bar">
      <div className="language-bar__inner">
        <nav className="language-nav">
          <ul className="language-nav__list">
            {language.list?.map((item) => (
              <li
                key={item.prefix}
                onClick={() => changeLanguage(item.prefix)}
                className={routePrefix === item.prefix ? "is-active" : ""}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export { LanguageNav as default, LanguageNav }
