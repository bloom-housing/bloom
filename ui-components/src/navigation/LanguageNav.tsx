import React, { useContext } from "react"
import { NavigationContext } from "../config/NavigationContext"
import "./LanguageNav.scss"
import { t } from "../helpers/translator"

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
  const { router } = useContext(NavigationContext)

  return (
    <div className="language-bar">
      <div className="language-bar__inner">
        <nav className="language-nav">
          <ul className="language-nav__list">
            {language.list?.map((item) => (
              <li key={item.prefix}>
                <button
                  onClick={() => {
                    void router.push(router.asPath, router.asPath, { locale: item.prefix || "en" })
                  }}
                  className={routePrefix === item.prefix ? "is-active" : ""}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export { LanguageNav as default, LanguageNav }
