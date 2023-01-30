/* eslint-disable @typescript-eslint/no-var-requires */
// Prints out a combination of an inputted csv file and existing translations file
// The CSV of the new translations must be in the format "key,value"
// Temporarily update the ui-components tsconfig to include `"module": "commonjs"`
// example: `ts-node generate-translations es new-spanish.csv > merged-spanish-translations.json`
const fs = require("fs")
const general = require("../locales/general.json")
const es = require("../locales/es.json")
const zh = require("../locales/zh.json")
const vi = require("../locales/vi.json")
const tl = require("../locales/tl.json")

function main() {
  if (process.argv.length < 4) {
    console.log(
      "usage: ts-node generate-translations es new-spanish.csv > merged-spanish-translations.json"
    )
    process.exit(1)
  }

  const languageMap = {
    general: general,
    es: es,
    zh: zh,
    vi: vi,
    tl: tl,
  }

  const [language, filePath] = process.argv.slice(2)

  // Process existing keys
  const mergedTranslations: string[] = []
  Object.keys(languageMap[language]).forEach((key) => {
    const formattedTranslation = `"${key}": "${languageMap[language][key]}",`
    mergedTranslations.push(JSON.stringify(formattedTranslation))
  })

  // Add new keys if not present
  const newTranslationsFile: string = fs.readFileSync(filePath, "utf-8")
  const newTranslations = newTranslationsFile.split("\n")
  newTranslations.forEach((translation: string) => {
    const [key, ...values] = translation.split(",")
    const value = values.join("_")
    if (!mergedTranslations[key]) {
      const formattedTranslation = `"${key}": "${value}",`
      mergedTranslations.push(JSON.stringify(formattedTranslation))
    }
  })

  mergedTranslations.sort()
  console.log("{")
  mergedTranslations.forEach((translation) => {
    console.log(JSON.parse(translation))
  })
  console.log("}")
}

void main()

export {}
