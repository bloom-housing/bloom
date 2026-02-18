/* eslint-disable @typescript-eslint/no-var-requires, import/no-unresolved */
// Finds missing translations and automatically translates them using Google Translate API
// Prints out translations in the JSON translation file format: "key": "translated string" and updates the translation files with the new translations, keeping all keys sorted alphabetically
// You will need to add the environment variables for Google Translate API access from the api env file into this env file
// Example: `ts-node get-machine-translations.ts`
import { Translate } from "@google-cloud/translate/build/src/v2"
import dotenv from "dotenv"
import fs from "fs"
import path from "path"
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
    "ko" = "ko",
    "hy" = "hy",
    "fa" = "fa",
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

  const readJsonFile = (filePath: string): TranslationsType => {
    const raw = fs.readFileSync(filePath, "utf8")
    return JSON.parse(raw) as TranslationsType
  }

  const writeSortedJsonFile = (filePath: string, translations: TranslationsType) => {
    const collator = new Intl.Collator(undefined)
    const toLine = (key: string, value: string) =>
      `  ${JSON.stringify(key)}: ${JSON.stringify(value)}`
    // This sorting function sorts keys alphabetically, but also ensures that keys with the same prefix are grouped together (e.g. "application.add" will be grouped with "application.add.demographics" rather than being sorted separately based on the first letter after the dot)
    const sorted = Object.fromEntries(
      Object.keys(translations)
        .sort((a, b) => collator.compare(toLine(a, translations[a]), toLine(b, translations[b])))
        .map((key) => [key, translations[key]])
    )
    const payload = `${JSON.stringify(sorted, null, 2)}\n`
    fs.writeFileSync(filePath, payload, "utf8")
  }

  // Load translations
  const localesDir = path.join(__dirname, "..", "locales")
  const englishTranslations = readJsonFile(path.join(localesDir, "general.json"))
  const spanishTranslations = readJsonFile(path.join(localesDir, "es.json"))
  const chineseTranslations = readJsonFile(path.join(localesDir, "zh.json"))
  const vietnameseTranslations = readJsonFile(path.join(localesDir, "vi.json"))
  const tagalogTranslations = readJsonFile(path.join(localesDir, "tl.json"))
  const arabicTranslations = readJsonFile(path.join(localesDir, "ar.json"))
  const bengaliTranslations = readJsonFile(path.join(localesDir, "bn.json"))
  const koreanTranslations = readJsonFile(path.join(localesDir, "ko.json"))
  const armenianTranslations = readJsonFile(path.join(localesDir, "hy.json"))
  const farsiTranslations = readJsonFile(path.join(localesDir, "fa.json"))

  const allTranslations = [
    {
      translationKeys: spanishTranslations,
      language: "Spanish",
      code: LanguagesEnum.es,
      filePath: path.join(localesDir, "es.json"),
    },
    {
      translationKeys: chineseTranslations,
      language: "Chinese",
      code: LanguagesEnum.zh,
      filePath: path.join(localesDir, "zh.json"),
    },
    {
      translationKeys: vietnameseTranslations,
      language: "Vietnamese",
      code: LanguagesEnum.vi,
      filePath: path.join(localesDir, "vi.json"),
    },
    {
      translationKeys: tagalogTranslations,
      language: "Tagalog",
      code: LanguagesEnum.tl,
      filePath: path.join(localesDir, "tl.json"),
    },
    {
      translationKeys: arabicTranslations,
      language: "Arabic",
      code: LanguagesEnum.ar,
      filePath: path.join(localesDir, "ar.json"),
    },
    {
      translationKeys: bengaliTranslations,
      language: "Bengali",
      code: LanguagesEnum.bn,
      filePath: path.join(localesDir, "bn.json"),
    },
    {
      translationKeys: koreanTranslations,
      language: "Korean",
      code: LanguagesEnum.ko,
      filePath: path.join(localesDir, "ko.json"),
    },
    {
      translationKeys: armenianTranslations,
      language: "Armenian",
      code: LanguagesEnum.hy,
      filePath: path.join(localesDir, "hy.json"),
    },
    {
      translationKeys: farsiTranslations,
      language: "Farsi",
      code: LanguagesEnum.fa,
      filePath: path.join(localesDir, "fa.json"),
    },
  ]

  console.log(
    "Note that Google Translate does not preserve markdown well, and you may need to adjust some translations manually to add back in new lines and other missing formatting if there is any markdown.\n"
  )
  console.log("This script will insert missing translations and keep keys sorted.\n")

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
      foreignTranslations.translationKeys[key] = translatedString
      console.log(`"${key}": "${translatedString}",`)
    })

    writeSortedJsonFile(foreignTranslations.filePath, foreignTranslations.translationKeys)
    console.log(`Updated ${foreignTranslations.filePath}`)
  }
}

void main()

export {}
