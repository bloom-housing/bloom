import * as React from "react"

import { HousingCounselor as Counselor } from "@bloom-housing/core"

import t from "../helpers/translator"

const LanguageLabel = (language: string) => {
  return (
    <span className="pill" key={language}>
      {language}
    </span>
  )
}
// TODO: Add icons for address, phone, link to better match original
const HousingCounselor = (props: { counselor: Counselor }) => {
  const counselor = props.counselor
  return (
    <div className="resource-item text-base">
      <h3 className="font-sans text-lg">
        <a href={counselor.website} target="_blank">
          {counselor.name}
        </a>
      </h3>
      <p className="text-sm text-gray-800 pb-2">
        {t("housingCounselors.languageServices")}
        {counselor.languages.map((language) => LanguageLabel(language))}
      </p>
      {counselor.address && (
        <p className="icon-item pb-2">
          {counselor.address} <br /> {counselor.citystate}
        </p>
      )}
      {counselor.phone && (
        <a className="icon-item pb-1" href={`tel:+1${counselor.phone}`}>
          {t("housingCounselors.call", { number: counselor.phone })}
        </a>
      )}
      {counselor.website && (
        <>
          <a className="icon-item" href={counselor.website}>
            {t("housingCounselors.visitWebsite", { name: counselor.name })}
          </a>
        </>
      )}
    </div>
  )
}

export { HousingCounselor as default, HousingCounselor }
