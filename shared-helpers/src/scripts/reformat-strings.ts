/* eslint-disable @typescript-eslint/no-var-requires */
// Reformats strings to flatten the object structure
// example: `ts-node reformat-strings > flattened-keys.json`

const englishTranslations = require("../locales/general.json")
const spanishTranslations = require("../locales/es.json")
const chineseTranslations = require("../locales/zh.json")
const vietnameseTranslations = require("../locales/vi.json")
const tagalogTranslations = require("../locales/tl.json")

function main() {
  type TranslationsType = {
    [key: string]: string | TranslationsType
  }

  const allTranslations = [
    { translationKeys: englishTranslations, language: "English" },
    { translationKeys: spanishTranslations, language: "Spanish" },
    { translationKeys: chineseTranslations, language: "Chinese" },
    { translationKeys: vietnameseTranslations, language: "Vietnamese" },
    { translationKeys: tagalogTranslations, language: "Tagalog" },
  ]

  const addEntry = (
    translationKey: string,
    parentKey: string,
    baseTranslations: TranslationsType | string,
    flattenedKeys: { [key: string]: string }[]
  ) => {
    flattenedKeys.push({
      key: parentKey ? `${parentKey}.${translationKey}` : translationKey,
      value: baseTranslations[translationKey],
    })
  }

  const flattenKeys = (
    baseTranslations: TranslationsType | string,
    flattenedKeys: { [key: string]: string }[],
    parentKey?: string
  ) => {
    Object.keys(baseTranslations).forEach((translationKey) => {
      if (typeof baseTranslations[translationKey] === "string") {
        addEntry(translationKey, parentKey || "", baseTranslations, flattenedKeys)
      }
      if (typeof baseTranslations[translationKey] !== "string") {
        flattenKeys(
          baseTranslations[translationKey],
          flattenedKeys,
          parentKey ? `${parentKey}.${translationKey}` : translationKey
        )
      }
    })
    return flattenedKeys
  }

  let flattenedKeys: { [key: string]: string }[] = []

  allTranslations.forEach((foreignKeys) => {
    console.log("--------------------")
    console.log(`Flattened keys for ${foreignKeys.language} translations:`)
    flattenedKeys = flattenKeys(foreignKeys.translationKeys, flattenedKeys, "")
    flattenedKeys.forEach((keys) => console.log(`"${keys.key}": ${JSON.stringify(keys.value)},`))
  })
}

void main()

export {}
