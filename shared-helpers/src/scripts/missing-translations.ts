/* eslint-disable @typescript-eslint/no-var-requires */
// Prints out keys/strings that exist in the english file but not in a foreign language translation file
// example: `ts-node missing-translations > missing-foreign-keys.json`
const englishTranslations = require("../locales/general.json")
const spanishTranslations = require("../locales/es.json")
const chineseTranslations = require("../locales/zh.json")
const vietnameseTranslations = require("../locales/vi.json")
const tagalogTranslations = require("../locales/tl.json")

function main() {
  type TranslationsType = {
    [key: string]: string
  }

  const allTranslations = [
    { translationKeys: spanishTranslations, language: "Spanish" },
    { translationKeys: chineseTranslations, language: "Chinese" },
    { translationKeys: vietnameseTranslations, language: "Vietnamese" },
    { translationKeys: tagalogTranslations, language: "Tagalog" },
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
  allTranslations.forEach((foreignKeys) => {
    console.log("--------------------")
    console.log(`Missing Public Site ${foreignKeys.language} Translations:`)
    const missingPublicSiteTranslations = findMissingStrings(
      englishTranslations,
      foreignKeys.translationKeys
    )
    if (missingPublicSiteTranslations.length > 0) missingTranslations = true
    missingPublicSiteTranslations.forEach((missingKey) =>
      console.log(`${missingKey}, ${JSON.stringify(englishTranslations[missingKey])}`)
    )
  })

  if (missingTranslations) throw Error
}

void main()

export {}
