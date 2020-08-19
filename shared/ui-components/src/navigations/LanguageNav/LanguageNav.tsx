import * as React from "react"
import "./LanguageNav.scss"
import { changeLang } from "../../helpers/translator"

type LangItem = {
  name: string
  label: string
}

export interface LanguageNavProps {
  items: LangItem[]
}

function change(name: string) {
  console.log("change lang", name)
}

const LanguageNav = ({ items }: LanguageNavProps) => (
  <div className="language-bar">
    <div className="language-bar__inner">
      <nav className="language-nav">
        <ul className="language-nav__list">
          {items?.map((item) => (
            <li key={item.name} onClick={() => changeLang(item.name)}>
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </div>
)

export { LanguageNav as default, LanguageNav }
