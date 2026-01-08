/* eslint-disable @typescript-eslint/no-var-requires, import/no-unresolved */
// Finds missing translations and automatically translates them using Google Translate API
// Prints out translations in the JSON translation file format: "key": "translated string"
// You will need to add the environment variables for Google Translate API access from the api env file into this env file
// Example: `ts-node get-machine-translations.ts > any-filename-here.json`
import { Translate } from "@google-cloud/translate/build/src/v2"
import dotenv from "dotenv"
dotenv.config({ quiet: true })

async function main() {
  enum LanguagesEnum {
    "en" = "en",
    "es" = "es",
    "vi" = "vi",
    "zh" = "zh",
    "tl" = "tl",
    "ar" = "ar",
    "bn" = "bn",
  }

  const GOOGLE_API_EMAIL = process.env.GOOGLE_API_EMAIL || ``
  const GOOGLE_API_ID = process.env.GOOGLE_API_ID || ``
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || ``

  const makeTranslateService = () => {
    return new Translate({
      credentials: {
        private_key: GOOGLE_API_KEY.replace(/\\n/gm, "\n"),
        client_email: GOOGLE_API_EMAIL,
      },
      projectId: GOOGLE_API_ID,
    })
  }

  const fetch = async (values: string[], language: LanguagesEnum) => {
    return await makeTranslateService().translate(values, {
      from: LanguagesEnum.en,
      to: language,
      format: "html",
    })
  }

  type TranslationsType = {
    [key: string]: string
  }

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

  // Load translations
  const englishTranslations = require("../locales/general.json")
  const spanishTranslations = require("../locales/es.json")
  const chineseTranslations = require("../locales/zh.json")
  const vietnameseTranslations = require("../locales/vi.json")
  const tagalogTranslations = require("../locales/tl.json")
  const arabicTranslations = require("../locales/ar.json")
  const bengaliTranslations = require("../locales/bn.json")

  const allTranslations = [
    { translationKeys: spanishTranslations, language: "Spanish", code: LanguagesEnum.es },
    { translationKeys: chineseTranslations, language: "Chinese", code: LanguagesEnum.zh },
    { translationKeys: vietnameseTranslations, language: "Vietnamese", code: LanguagesEnum.vi },
    { translationKeys: tagalogTranslations, language: "Tagalog", code: LanguagesEnum.tl },
    { translationKeys: arabicTranslations, language: "Arabic", code: LanguagesEnum.ar },
    { translationKeys: bengaliTranslations, language: "Bengali", code: LanguagesEnum.bn },
  ]

  console.log(
    "Note that Google Translate does not preserve markdown well, and you may need to adjust some translations manually to add back in new lines and other missing formatting if there is any markdown.\n"
  )
  console.log(
    "You can paste these lines directly into each translation file, and then be sure to sort ascending! In VSCode, you can Command + Shift + P --> Sort Ascending.\n"
  )

  // Process each language
  for (const foreignTranslations of allTranslations) {
    console.log("\n--------------------")
    console.log(`${foreignTranslations.language} Missing Translations:`)
    console.log("--------------------")

    const missingKeys = findMissingStrings(englishTranslations, foreignTranslations.translationKeys)

    if (missingKeys.length === 0) {
      console.log(`No missing translations for ${foreignTranslations.language}`)
      continue
    }

    const englishStrings = missingKeys.map((key) => englishTranslations[key])
    const translatedValues = await fetch(englishStrings, foreignTranslations.code)

    missingKeys.forEach((key, index) => {
      const translatedString = translatedValues[0][index]
      console.log(`"${key}": "${translatedString}",`)
    })
  }
}

void main()

export {}
