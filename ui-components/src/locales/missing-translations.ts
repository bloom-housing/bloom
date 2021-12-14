/* eslint-disable @typescript-eslint/no-var-requires */
const englishTranslations = require("./general.json")
const spanishTranslations = require("./es.json")
const chineseTranslations = require("./zh.json")
const vietnameseTranslations = require("./vi.json")
const tagalogTranslations = require("./tl.json")

function main() {
  type TranslationsType = {
    [key: string]: string | TranslationsType
  }

  const allTranslations = [
    { translationKeys: spanishTranslations, language: "es" },
    { translationKeys: chineseTranslations, language: "zh" },
    { translationKeys: vietnameseTranslations, language: "vi" },
    { translationKeys: tagalogTranslations, language: "tl"}
  ]

  const addEntry = (
    translationKey: string,
    parentKey: string,
    baseTranslations: TranslationsType | string,
    missingTranslations: { [key: string]: string[] },
    language: string
  ) => {
    const mapKey = `${parentKey}.${translationKey}, "${baseTranslations[translationKey]}"`
    if (!missingTranslations[mapKey]) {
      missingTranslations[mapKey] = []
    }
    missingTranslations[mapKey].push(language)
  }

  const checkTranslations = (
    baseTranslations: TranslationsType | string,
    checkedTranslations: TranslationsType | string,
    missingTranslations: { [key: string]: string[] },
    language: string,
    parentKey?: string
  ) => {
    Object.keys(baseTranslations).forEach((translationKey) => {
      if (
        typeof baseTranslations[translationKey] === "string" &&
        !checkedTranslations[translationKey]
      ) {
        addEntry(translationKey, parentKey || "", baseTranslations, missingTranslations, language)
      }
      if (typeof baseTranslations[translationKey] !== "string") {
        checkTranslations(
          baseTranslations[translationKey],
          !checkedTranslations[translationKey] ? {} : checkedTranslations[translationKey],
          missingTranslations,
          language,
          parentKey ? `${parentKey}.${translationKey}` : translationKey
        )
      }
    })
    return missingTranslations
  }

  const checkAllTranslations = () => {
    return allTranslations.reduce((acc, item) => {
      return checkTranslations(englishTranslations, item.translationKeys, acc, item.language)
    }, {})
  }

  const missingTranslations = checkAllTranslations()
  console.log(missingTranslations)
}
void main()

export {}
