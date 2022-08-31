import React from "react"
import "./LanguageNav.scss"

export type LangItem = {
  label: string
  onClick: () => void
  active: boolean
}

export interface LanguageNavProps {
  ariaLabel?: string
  languages: LangItem[]
}

const LanguageNav = ({ ariaLabel, languages }: LanguageNavProps) => {
  return (
    <div className="language-bar">
      <div className="language-bar__inner">
        <nav {...{ "aria-label": ariaLabel ?? "Language" }} className="language-nav">
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
