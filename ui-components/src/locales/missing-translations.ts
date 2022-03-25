/* eslint-disable @typescript-eslint/no-var-requires */
// Suggested to run with `ts-node`
const englishTranslations = require("./general.json")
const spanishTranslations = require("./es.json")
const chineseTranslations = require("./zh.json")
const vietnameseTranslations = require("./vi.json")
const tagalogTranslations = require("./tl.json")

function main() {
  type TranslationsType = {
    [key: string]: string
  }

  const allTranslations = [
    { translationKeys: spanishTranslations, language: "es" },
    { translationKeys: chineseTranslations, language: "zh" },
    { translationKeys: vietnameseTranslations, language: "vi" },
    { translationKeys: tagalogTranslations, language: "tl" },
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

  console.log("Missing Public Site Spanish Translations:")
  const missingPublicSiteSpanishTranslations = findMissingStrings(
    englishTranslations,
    spanishTranslations
  )
  missingPublicSiteSpanishTranslations.forEach((missingKey) => console.log(missingKey))
}
void main()

export {}
