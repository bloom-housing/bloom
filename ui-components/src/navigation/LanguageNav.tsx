import React from "react"
import "./LanguageNav.scss"
import { t } from "../helpers/translator"

export type LangItem = {
  label: string
  onClick: () => void
  active: boolean
}

export interface LanguageNavProps {
  languages: LangItem[]
}

const LanguageNav = ({ languages }: LanguageNavProps) => {
  return (
    <div className="language-bar">
      <div className="language-bar__inner">
        <h2 className="sr-only">{t("languages.srHeading")}</h2>
        <nav className="language-nav" aria-label={t("languages.srNavigation")}>
          <ul className="language-nav__list">
            {languages.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => {
                    item.onClick()
                  }}
                  className={
                    item.active
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
