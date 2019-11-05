import * as React from "react"

import { HousingCounselor as Counselor } from "@bloom/core/src/HousingCounselors"

import t from "@bloom/ui-components/src/helpers/translator"

const LanguageLabel = (language: string) => {
  return (
    <span
      className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
      key={language}
    >
      {language}
    </span>
  )
}
// TODO: Add icons for address, phone, link to better match original
const HousingCounselor = (props: { counselor: Counselor }) => {
  const counselor = props.counselor
  return (
    <>
      <h3>
        <a href={counselor.website} target="_blank">
          {counselor.name}
        </a>
      </h3>
      <p className="text-sm text-gray-700 pb-3">
        {t("housingCounselors.languageServices")}
        {counselor.languages.map(language => LanguageLabel(language))}
      </p>
      {counselor.address && (
        <p>
          {counselor.address} <br /> {counselor.citystate}
        </p>
      )}
      {counselor.phone && (
        <a href={`tel:+1${counselor.phone}`}>
          {t("housingCounselors.call", { number: counselor.phone })}
        </a>
      )}
      {counselor.website && (
        <>
          <br />
          <a href={counselor.website}>
            {t("housingCounselors.visitWebsite", { name: counselor.name })}
          </a>
        </>
      )}
    </>
  )
}

export default HousingCounselor
