import * as React from "react"
import "./LanguageNav.scss"
import { LanguageNav, LangItem } from "./LanguageNav"
import { useLanguageChange } from "../helpers/useLanguageChange"
import { t } from "../helpers/translator"

interface RoutedLanguageNavProps {
  items: LangItem[]
}

const RoutedLanguageNav = ({ items }: RoutedLanguageNavProps) => {
  const onLanguageChange = useLanguageChange(items)

  return (
    <LanguageNav
      onChangeLanguage={(item) => onLanguageChange(item.prefix)}
      currentLanguagePrefix={t("config.routePrefix")}
      items={items}
    />
  )
}

export { RoutedLanguageNav as default, RoutedLanguageNav }
