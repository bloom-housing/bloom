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
        <h2 className="sr-only">{t("languages.srHeading")}</h2>
        <nav className="language-nav" aria-label={t("languages.srNavigation")}>
          <ul className="language-nav__list">
            {language.list?.map((item) => (
              <li key={item.prefix}>
                <button
                  onClick={() => {
                    void router.push(router.asPath, router.asPath, { locale: item.prefix || "en" })
                  }}
                  className={
                    routePrefix === item.prefix
                      ? "language-nav__list-button is-active"
                      : "language-nav__list-button"
                  }
                  type="button"
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
