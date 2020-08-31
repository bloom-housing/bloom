import * as React from "react"
import "./LanguageNav.scss"
import { useRouter } from "next/router"
import { t } from "../../helpers/translator"

type LangItem = {
  name: string
  label: string
  path: string
}

export interface LanguageNavProps {
  items: LangItem[]
}

const LanguageNav = ({ items }: LanguageNavProps) => {
  const routePrefix = t("config.routePrefix")

  return (
    <div className="language-bar">
      <div className="language-bar__inner">
        <nav className="language-nav">
          <ul className="language-nav__list">
            {items?.map((item) => (
              <li key={item.name}>
                <a href={item.path} className={routePrefix === item.name ? "is-active" : ""}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export { LanguageNav as default, LanguageNav }
