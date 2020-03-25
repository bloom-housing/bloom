import * as React from "react"
import { Preference, PreferenceLink } from "@bloom-housing/core"
//import t from "@bloom-housing/ui-components/src/helpers/translator"
import "./PreferencesList.scss"

export interface PreferencesListProps {
  preferences: Preference[]
}

const PreferencesList = (props: PreferencesListProps) => {
  const preferences = props.preferences.map((preference: Preference, index: number) => {
    const ordinalNumber = parseInt(preference.ordinal, 10)
    const ordinalSup = <sup>{preference.ordinal.replace(ordinalNumber.toString(), "")}</sup>

    const itemClasses = ["preferences-list__item", "info-card"]

    if (!preference.subtitle && !preference.description && !preference.links) {
      itemClasses.push("preferences-list__item--title-only")
    }

    return (
      <li key={index} className={itemClasses.join(" ")}>
        <div className="preferences-list__number">
          {ordinalNumber}
          {ordinalSup}
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
