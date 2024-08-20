/* eslint-disable @typescript-eslint/no-var-requires, import/no-unresolved */

// Takes in a CSV file with two columns (t_key,t_value) with the key being the translation file key and the value being the associated English string, and prints out in the JSON translation file format the "key": "translated string"
// CSV format:
// t_key,t_value
// "key.here","Translation here"
//
// example from within this directory, first argument is one of LanguagesEnum and second argument is the formatted CSV filename with keys and english strings, piped to a new file: `ts-node get-machine-translations es english-keys.csv > any-filename-here.json`
import fs from "node:fs"
import { parse } from "csv-parse/sync"

import { Translate } from "@google-cloud/translate/build/src/v2"

async function main(argv: string[]) {
  enum LanguagesEnum {
    "en" = "en",
    "es" = "es",
    "vi" = "vi",
    "zh" = "zh",
    "tl" = "tl",
  }

  const GOOGLE_API_EMAIL = "SECRET_VALUE"
  const GOOGLE_API_ID = "SECRET_VALUE"
  const GOOGLE_API_KEY = "SECRET_VALUE"

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
    })
  }

  const [language, englishStringsCsv] = argv.slice(2)

  const csvFile = fs.readFileSync(englishStringsCsv)

  const csvData = parse(csvFile, {
    columns: true,
    skip_empty_lines: true,
  })

  for (const row of csvData) {
    const tKey = row["t_key"].trim()
    const tValue = row["t_value"].trim()
    const translatedValue = await fetch([tValue], language as LanguagesEnum)
    console.log(`"${tKey}": "${translatedValue[0][0]}",`)
  }
}

void main(process.argv)

export {}
