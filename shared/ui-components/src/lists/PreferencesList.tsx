import * as React from "react"
import { Preference, PreferenceLink } from "@bloom-housing/core/src/preferences"
//import t from "@bloom-housing/ui-components/src/helpers/translator"
import "./PreferencesList.scss"

interface PreferencesListProps {
  preferences: Preference[]
}

const PreferencesList = (props: PreferencesListProps) => {
  const preferences = props.preferences.map((preference: Preference, index: number) => {
    const ordinalNumber = parseInt(preference.ordinal, 10)
    const ordinalSup = <sup>{preference.ordinal.replace(ordinalNumber.toString(), "")}</sup>

    const itemClasses = ["preferences-list_item", "info-card"]

    if (!preference.subtitle && !preference.description && !preference.links) {
      itemClasses.push("preferences-list_item--title-only")
    }

    return (
      <li key={index} className={itemClasses.join(" ")}>
        <div className="preferences-list_number text-sm">
          {ordinalNumber}
          {ordinalSup}
        </div>
        <h4 className="info-card__title mb-0 ml-4 md:ml-2">{preference.title}</h4>
        {preference.subtitle && (
          <div className="text-gray-700 text-tiny ml-4 md:ml-2">{preference.subtitle}</div>
        )}
        {preference.description && (
          <div className="text-gray-700 text-sm mt-3">{preference.description}</div>
        )}
        {preference.links && (
          <div className="preferences-list_links text-tiny mt-3">
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

export default PreferencesList
