/* eslint-disable @typescript-eslint/no-var-requires */
// Prints out keys/strings that exist in the english file but not in a foreign language translation file
// Temporarily update the ui-components tsconfig to include `"module": "commonjs"`
// example: `ts-node scripts/missing-translations > missing-foreign-keys.csv`

function main() {
  type TranslationsType = {
    [key: string]: string
  }

  type MissingTranslations = {
    [key: string]: TranslationInfo
  }

  type TranslationInfo = {
    value: string
    location: string
  }

  const enBaseTranslations = require("../src/locales/general.json")
  const esBaseTranslations = require("../src/locales/es.json")
  const arBaseTranslations = require("../src/locales/ar.json")
  const bnBaseTranslations = require("../src/locales/bn.json")

  const enOverrideTranslations = require("../../sites/public/page_content/locale_overrides/general.json")
  const esOverrideTranslations = require("../../sites/public/page_content/locale_overrides/es.json")
  const arOverrideTranslations = require("../../sites/public/page_content/locale_overrides/ar.json")
  const bnOverrideTranslations = require("../../sites/public/page_content/locale_overrides/bn.json")

  const allTranslations = [
    {
      baseTranslations: esBaseTranslations,
      overrideTranslations: esOverrideTranslations,
      language: "Spanish",
    },
    {
      baseTranslations: arBaseTranslations,
      overrideTranslations: arOverrideTranslations,
      language: "Arabic",
    },
    {
      baseTranslations: bnBaseTranslations,
      overrideTranslations: bnOverrideTranslations,
      language: "Bengali",
    },
  ]

  const findMissingStrings = (
    enBaseTranslations: TranslationsType,
    enOverrideTranslations: TranslationsType,
    checkBaseTranslations: TranslationsType,
    checkOverrideTranslations: TranslationsType
  ) => {
    const missingTranslations: MissingTranslations[] = []
    //Comparison of override files
    const enOverrideKeys = Object.keys(enOverrideTranslations)
    const checkOverrideKeys = Object.keys(checkOverrideTranslations)
    enOverrideKeys.forEach((key) => {
      if (!checkOverrideKeys.includes(key)) {
        missingTranslations[key] = { value: enOverrideTranslations[key], location: "override" }
      }
    })
    //Comparison of base files
    const enBaseKeys = Object.keys(enBaseTranslations)
    const checkBaseKeys = Object.keys(checkBaseTranslations)
    enBaseKeys.forEach((key) => {
      if (!enOverrideKeys.includes(key)) {
        if (!checkBaseKeys.includes(key)) {
          missingTranslations[key] = { value: enBaseTranslations[key], location: "ui-components" }
        }
      }
    })

    return missingTranslations
  }

  allTranslations.forEach((translationSet) => {
    console.log("--------------------")
    console.log(`Missing Public Site ${translationSet.language} Translations:`)
    const missingPublicSiteTranslations: MissingTranslations[] = findMissingStrings(
      enBaseTranslations,
      enOverrideTranslations,
      translationSet.baseTranslations,
      translationSet.overrideTranslations
    )
    Object.entries(missingPublicSiteTranslations).forEach((entry) =>
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.log(`${entry[0]},${entry[1].location},"${entry[1].value}"`)
    )
  })
}

void main()

export {}
