import * as React from "react"
import { t, Icon, IconFillColors } from "@bloom-housing/ui-components"

export interface HousingCounselorProps {
  addressCityState?: string
  addressStreet?: string
  languages: string[]
  name: string
  phone?: string
  website?: string
  strings?: {
    callNumber?: string
    languageServices?: string
    website?: string
  }
}

const LanguageLabel = (language: string) => {
  return (
    <span className="pill" key={language}>
      {language}
    </span>
  )
}

const HousingCounselor = (props: HousingCounselorProps) => {
  return (
    <div className="resource-item text-base">
      <h3 className="font-sans text-xl">{props.name}</h3>
      <p className="text-xs text-gray-800 pb-2">
        {props.strings?.languageServices ?? t("housingCounselors.languageServices")}
        {props.languages.map((language) => LanguageLabel(language))}
      </p>
      {props.addressStreet && (
        <p className="icon-item pb-2">
          {props.addressStreet} <br /> {props.addressCityState}
        </p>
      )}
      {props.phone && (
        <a className="icon-item pb-1" href={`tel:+1${props.phone}`}>
          <Icon symbol="phone" size="medium" fill={IconFillColors.primary} />
          {` ${props.strings?.callNumber ?? t("housingCounselors.call", { number: props.phone })}`}
        </a>
      )}
      {props.website && (
        <a className="icon-item" href={props.website}>
          <Icon symbol="globe" size="medium" fill={IconFillColors.primary} />
          {` ${props.strings?.website ?? t("t.website")}`}
        </a>
      )}
    </div>
  )
}

export { HousingCounselor as default, HousingCounselor }
