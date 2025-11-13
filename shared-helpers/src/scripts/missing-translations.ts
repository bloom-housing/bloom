/* eslint-disable @typescript-eslint/no-var-requires */
// Prints out keys/strings that exist in the english file but not in a foreign language translation file
// example: `ts-node missing-translations > missing-foreign-keys.json`
const englishTranslations = require("../locales/general.json")
const spanishTranslations = require("../locales/es.json")
const chineseTranslations = require("../locales/zh.json")
const vietnameseTranslations = require("../locales/vi.json")
const tagalogTranslations = require("../locales/tl.json")
const arabicTranslations = require("../locales/ar.json")
const bengaliTranslations = require("../locales/bn.json")

function main() {
  type TranslationsType = {
    [key: string]: string
  }

  const allTranslations = [
    { translationKeys: spanishTranslations, language: "Spanish" },
    { translationKeys: chineseTranslations, language: "Chinese" },
    { translationKeys: vietnameseTranslations, language: "Vietnamese" },
    { translationKeys: tagalogTranslations, language: "Tagalog" },
    { translationKeys: arabicTranslations, language: "Arabic" },
    { translationKeys: bengaliTranslations, language: "Bengali" },
  ]

  const findMissingStrings = (
    baseTranslations: TranslationsType,
    checkedTranslations: TranslationsType
  ) => {
    const baseKeys = Object.keys(baseTranslations)
    const checkedKeys = Object.keys(checkedTranslations)
    const missingKeys: string[] = []
    baseKeys.forEach((key) => {
      if (checkedKeys.indexOf(key) < 0) {
        missingKeys.push(key)
      }
    })
    return missingKeys
  }

  let missingTranslations = false
  console.log(
    "Save the below data including the t_ headers per-language in a csv, and pass it to get-machine-translations.ts to get machine translated strings in the correct format."
  )
  allTranslations.forEach((foreignKeys) => {
    console.log("--------------------")
    console.log(`Missing Public Site ${foreignKeys.language} Translations:`)
    console.log("t_key,t_value")
    const missingPublicSiteTranslations = findMissingStrings(
      englishTranslations,
      foreignKeys.translationKeys
    )
    if (missingPublicSiteTranslations.length > 0) missingTranslations = true
    missingPublicSiteTranslations.forEach((missingKey) =>
      console.log(`${missingKey},${JSON.stringify(englishTranslations[missingKey])}`)
    )
  })
  if (missingTranslations) throw Error("Missing translations found")
}

void main()

export {}
