import * as React from "react"
import "./LanguageNav.scss"
import { t } from "../helpers/translator"
import { useRouter } from "next/router"

export type LangItem = {
  prefix: string
  label: string
}

export interface LanguageNavProps {
  items: LangItem[]
}

const LanguageNav = ({ items }: LanguageNavProps) => {
  const routePrefix = t("config.routePrefix")
  const router = useRouter()

  return (
    <div className="language-bar">
      <div className="language-bar__inner">
        <nav className="language-nav">
          <ul className="language-nav__list">
            {items?.map((item) => (
              <li
                key={item.prefix}
                onClick={() => {
                  void router.push(router.asPath, router.asPath, { locale: item.prefix || "en" })
                }}
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
