/* eslint-disable @typescript-eslint/no-var-requires, import/no-unresolved */

// Usage:
// ts-node --skip-project src/scripts/import-new-translations.ts tl Tagalog.csv
//
// Requires an input CSV with three columns: English, Translation, and (optionally) Updated Translation

import fs from "node:fs"
import { parse } from "csv-parse/sync"

const general = require("../locales/general.json")
const es = require("../locales/es.json")
const zh = require("../locales/zh.json")
const vi = require("../locales/vi.json")
const tl = require("../locales/tl.json")

function main(argv: string[]) {
  const [language, filePath] = argv.slice(2)
  console.log(language, filePath)
  const csvFile = fs.readFileSync(filePath)

  const languageMap: Record<string, any> = {
    general,
    es,
    zh,
    vi,
    tl,
  }

  const languageJson = languageMap[language]

  const csvData = parse(csvFile, {
    columns: true,
    skip_empty_lines: true,
  })

  const notFoundRows = []
  let foundCount = 0

  for (const row of csvData) {
    const englishText = row["English"].trim()
    const found = Object.entries(general).find(([, value]) => {
      return (value as string).trim() == englishText
    })
    const newTranslationValue =
      row["Updated Translation"] && row["Updated Translation"].length > 0
        ? row["Updated Translation"]
        : row["Translation"]

    if (found) {
      foundCount++
      const [translationKey] = found
      languageJson[translationKey] = newTranslationValue
    } else {
      notFoundRows.push({ englishText: englishText, translatedText: newTranslationValue })
    }
  }

  const sortedLanguageJson = Object.fromEntries(Object.entries(languageJson).sort())

  fs.writeFileSync(`src/locales/${language}.json`, JSON.stringify(sortedLanguageJson, null, "  "))

  fs.writeFileSync(`src/locales/MISSING_${language}.json`, JSON.stringify(notFoundRows, null, "  "))

  console.log(
    `✅ Found ${foundCount} translations, couldn't find ❌ ${notFoundRows.length} translations.`
  )
}

void main(process.argv)

export {}
