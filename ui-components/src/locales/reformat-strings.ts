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

  const addEntry = (
    translationKey: string,
    parentKey: string,
    baseTranslations: TranslationsType | string,
    flattenedKeys: { [key: string]: string }[]
  ) => {
    flattenedKeys.push({
      key: `${parentKey}.${translationKey}`,
      value: baseTranslations[translationKey],
    })
  }

  const checkTranslations = (
    baseTranslations: TranslationsType | string,
    flattenedKeys: { [key: string]: string }[],
    parentKey?: string
  ) => {
    Object.keys(baseTranslations).forEach((translationKey) => {
      if (typeof baseTranslations[translationKey] === "string") {
        addEntry(translationKey, parentKey || "", baseTranslations, flattenedKeys)
      }
      if (typeof baseTranslations[translationKey] !== "string") {
        checkTranslations(
          baseTranslations[translationKey],
          flattenedKeys,
          parentKey ? `${parentKey}.${translationKey}` : translationKey
        )
      }
    })
    return flattenedKeys
  }

  let flattenedKeys: { [key: string]: string }[] = []

  // Update the base keys with any language file
  flattenedKeys = checkTranslations(englishTranslations, flattenedKeys, "")
  console.log(
    flattenedKeys.forEach((keys) => console.log(`"${keys.key}": ${JSON.stringify(keys.value)},`))
  )
}

void main()

export {}
