import * as React from "react"
import { Preference, PreferenceLink } from "@bloom-housing/backend-core/types"
import "./PreferencesList.scss"
import { locale } from "../helpers/translator"

export interface PreferencesListProps {
  preferences: Preference[]
}

const getOrdinal = (n: number) => {
  if (locale() == "en") {
    const s = ["th", "st", "nd", "rd"]
    const v = n % 100
    return s[(v - 20) % 10] || s[v] || s[0]
  } else {
    return ""
  }
}

const PreferencesList = (props: PreferencesListProps) => {
  const filteredPreferences = props.preferences.filter(
    (pref) => !pref.formMetadata?.hideFromListing
  )
  const preferences = filteredPreferences.map((preference: Preference, index: number) => {
    const itemClasses = ["preferences-list__item", "info-card"]

    if (!preference.subtitle && !preference.description && !preference.links) {
      itemClasses.push("preferences-list__item--title-only")
    }

    return (
      <li key={index} className={itemClasses.join(" ")}>
        <div className="preferences-list__number">
          {preference.ordinal}
          <sup>{getOrdinal(preference.ordinal)}</sup>
        </div>
        <h4 className="info-card__title">{preference.title}</h4>
        {preference.subtitle && (
          <div className="preferences-list__subtitle">{preference.subtitle}</div>
        )}
        {preference.description && (
          <div className="preferences-list__description">{preference.description}</div>
        )}
        {preference.links && (
          <div className="preferences-list__links">
            {preference.links.map((link: PreferenceLink, linkIndex: number) => (
              <span key={linkIndex}>
                <a href={link.url}>{link.title}</a>
              </span>
            ))}
          </div>
        )}
      </li>
    )
  })

  return <ol className="preferences-list">{preferences}</ol>
}

export { PreferencesList as default, PreferencesList }
