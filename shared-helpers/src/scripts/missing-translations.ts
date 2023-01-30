/* eslint-disable @typescript-eslint/no-var-requires */
// Prints out keys/strings that exist in the english file but not in a foreign language translation file
// Temporarily update the ui-components tsconfig to include `"module": "commonjs"`
// from the scripts folder run `yarn ts-node scripts/missing-translations > hba-missing-translations.csv`

function main() {
  type TranslationsType = {
    [key: string]: string
  }

  type JurisdictionOverrideMap = {
    [key: string]: MissingTranslation[]
  }

  type MissingTranslation = {
    [key: string]: TranslationInfo
  }

  type TranslationInfo = {
    value: string
    location: string
    jurisOverrides: string[]
  }
  const jurisdictions = ["alameda", "san_jose", "san_mateo"]

  const jurisOverrideTracker: JurisdictionOverrideMap[] = []

  const enBaseTranslations = require("../locales/general.json")
  const esBaseTranslations = require("../locales/es.json")
  const zhBaseTranslations = require("../locales/zh.json")
  const viBaseTranslations = require("../locales/vi.json")
  const tlBaseTranslations = require("../locales/tl.json")

  const baseTranslations = [
    {
      baseTranslations: esBaseTranslations,
      language: "Spanish",
    },
    {
      baseTranslations: zhBaseTranslations,
      language: "Chinese",
    },
    {
      baseTranslations: viBaseTranslations,
      language: "Vietnamese",
    },
    {
      baseTranslations: tlBaseTranslations,
      language: "Tagalog",
    },
  ]

  const enOverrideTranslations = require("../../sites/public/page_content/locale_overrides/general.json")

  const findMissingBaseTranslations = (
    enBaseTranslations: TranslationsType,
    checkBaseTranslations: TranslationsType,
    jurisOverrideTracker: JurisdictionOverrideMap[]
  ) => {
    const missingTranslations: MissingTranslation[] = []
    const enBaseKeys = Object.keys(enBaseTranslations)
    const checkBaseKeys = Object.keys(checkBaseTranslations)
    enBaseKeys.forEach((key) => {
      const jurisOverrideArr: string[] = []
      Object.entries(jurisOverrideTracker).forEach((entry) => {
        if (Object.keys(entry[1]).includes(key)) jurisOverrideArr.push(entry[0])
      })
      if (
        // not overriden by all jurisdictions
        jurisOverrideArr.length !== jurisdictions.length &&
        // not overriden by hba-wide override file
        !Object.keys(enOverrideTranslations).includes(key) &&
        // doesn't have translations
        !checkBaseKeys.includes(key)
      ) {
        missingTranslations[key] = {
          value: enBaseTranslations[key],
          location: "ui-components",
          jurisOverrides: jurisOverrideArr.toString(),
        }
      }
    })
    return missingTranslations
  }
  jurisdictions.forEach((jurisdiction) => {
    const enJurisTranslations = require(`../../sites/public/page_content/jurisdiction_overrides/${jurisdiction}/locale_overrides/general.json`)
    const esJurisTranslations = require(`../../sites/public/page_content/jurisdiction_overrides/${jurisdiction}/locale_overrides/es.json`)
    const zhJurisTranslations = require(`../../sites/public/page_content/jurisdiction_overrides/${jurisdiction}/locale_overrides/zh.json`)
    const viJurisTranslations = require(`../../sites/public/page_content/jurisdiction_overrides/${jurisdiction}/locale_overrides/vi.json`)
    let tlJurisTranslations = null
    if (jurisdiction === "alameda") {
      tlJurisTranslations = require(`../../sites/public/page_content/jurisdiction_overrides/${jurisdiction}/locale_overrides/tl.json`)
    }

    const jurisTranslations = [
      {
        jurisTranslations: esJurisTranslations,
        language: "Spanish",
      },
      {
        jurisTranslations: zhJurisTranslations,
        language: "Chinese",
      },
      {
        jurisTranslations: viJurisTranslations,
        language: "Vietnamese",
      },
    ]

    if (jurisdiction === "alameda") {
      jurisTranslations.push({
        jurisTranslations: tlJurisTranslations,
        language: "Tagalog",
      })
    }

    const findMissingOverrideTranslations = (
      enJurisTranslations: TranslationsType,
      checkJurisTranslations: TranslationsType,
      enOverrideTranslations: TranslationsType
    ) => {
      const missingTranslations: MissingTranslation[] = []
      //Comparison of jurisdictional files
      const enJurisKeys = Object.keys(enJurisTranslations)
      const checkJurisKeys = Object.keys(checkJurisTranslations)
      enJurisKeys.forEach((key) => {
        if (!checkJurisKeys.includes(key)) {
          missingTranslations[key] = {
            value: enJurisTranslations[key],
            location: `${jurisdiction} override`,
          }
        }
      })
      //Comparison of override files
      const enOverrideKeys = Object.keys(enOverrideTranslations)
      enOverrideKeys.forEach((key) => {
        //don't need to check for translations since no other override files
        if (!enJurisKeys.includes(key)) {
          missingTranslations[key] = {
            value: enOverrideTranslations[key],
            location: "General Override",
          }
        }
      })
      return missingTranslations
    }

    console.log(`------------${jurisdiction} translations------------`)
    jurisTranslations.forEach((translationSet) => {
      console.log(`Missing Public Site ${translationSet.language} Translations:`)
      const missingOverrideTranslations: MissingTranslation[] = findMissingOverrideTranslations(
        enJurisTranslations,
        translationSet.jurisTranslations,
        enOverrideTranslations
      )
      Object.entries(missingOverrideTranslations).forEach((entry) =>
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`${entry[0]},${entry[1].location},"${entry[1].value}"`)
      )
    })
    jurisOverrideTracker[jurisdiction] = enJurisTranslations
  })
  console.log("------------Shared translations------------")
  baseTranslations.forEach((translationSet) => {
    const missingBaseTranslations = findMissingBaseTranslations(
      enBaseTranslations,
      translationSet.baseTranslations,
      jurisOverrideTracker
    )
    Object.entries(missingBaseTranslations).forEach((entry) =>
      console.log(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${entry[0]},${entry[1].location},"${entry[1].value}","${entry[1].jurisOverrides}"`
      )
    )
  })
}

void main()

export {}
