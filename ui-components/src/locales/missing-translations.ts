const englishTranslations = require("./general.json")
const spanishTranslations = require("./es.json")
const chineseTranslations = require("./zh.json")
const vietnameseTranslations = require("./vi.json")

async function main() {
  type TranslationsType = {
    [key: string]: string | TranslationsType
  }

  const allTranslations = [
    { translationKeys: spanishTranslations, language: "es" },
    { translationKeys: chineseTranslations, language: "zh" },
    { translationKeys: vietnameseTranslations, language: "vi" },
  ]

  const addEntry = (
    translationKey: string,
    parentKey: string,
    baseTranslations: TranslationsType | string,
    missingTranslations: { [key: string]: string[] },
    language: string
  ) => {
    if (
      !missingTranslations[`${parentKey}.${translationKey}, "${baseTranslations[translationKey]}"`]
    ) {
      missingTranslations[
        `${parentKey}.${translationKey}, "${baseTranslations[translationKey]}"`
      ] = []
    }
    missingTranslations[
      `${parentKey}.${translationKey}, "${baseTranslations[translationKey]}"`
    ].push(language)
  }

  const addMissingBlock = (
    baseTranslations: TranslationsType | string,
    missingTranslations: { [key: string]: string[] },
    language: string,
    parentKey?: string
  ) => {
    Object.keys(baseTranslations).forEach((translationKey) => {
      if (typeof baseTranslations[translationKey] === "string") {
        addEntry(translationKey, parentKey || "", baseTranslations, missingTranslations, language)
      } else {
        addMissingBlock(
          baseTranslations[translationKey],
          missingTranslations,
          language,
          parentKey ? `${parentKey}.${translationKey}` : translationKey
        )
      }
    })
  }

  const checkTranslations = (
    baseTranslations: TranslationsType | string,
    checkedTranslations: TranslationsType | string,
    missingTranslations: { [key: string]: string[] },
    language: string,
    parentKey?: string
  ) => {
    Object.keys(baseTranslations).forEach((translationKey) => {
      // Missing translation block entirely, add by mapping over english strings
      if (typeof baseTranslations[translationKey] !== "string" && !checkedTranslations[translationKey]) {
        addMissingBlock(
          baseTranslations[translationKey],
          missingTranslations,
          language,
          parentKey ? `${parentKey}.${translationKey}` : translationKey
        )
        return
      }
      // Missing individual translation key
      if (
        typeof baseTranslations[translationKey] === "string" &&
        !checkedTranslations[translationKey]
      ) {
        addEntry(translationKey, parentKey || "", baseTranslations, missingTranslations, language)
      }
      // If this is just a block, continue with that block
      if (typeof baseTranslations[translationKey] !== "string") {
        checkTranslations(
          baseTranslations[translationKey],
          checkedTranslations[translationKey],
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
