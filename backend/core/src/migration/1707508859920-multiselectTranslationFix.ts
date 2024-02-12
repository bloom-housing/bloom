import { MigrationInterface, QueryRunner } from "typeorm"

export class multiselectTranslationFix1707508859920 implements MigrationInterface {
  name = "multiselectTranslationFix1707508859920"

  // construct translation object for multiselect questions
  listingPrefencesTranslations = {
    en: [
      {
        text: "Historical BART Displacement ",
        options: [
          "Someone in my household already has a BART Construction Displacement preference certificate.",
          "Someone in my household is applying for, or will apply for, a BART Construction Displacement preference certificate.",
          "Nobody in my household has been displaced, or has family that has been displaced, due to BART construction.",
        ],
      },
      {
        text: "Households with Children ",
        options: [
          "My household includes children under the age of 18.",
          "My household does not include children",
        ],
      },
      {
        text: "Displacement due to Eviction",
        options: [
          "I, or a member of my household, was displaced due to no-fault or nonpayment-related eviction within the past seven years in Berkeley.",
          "No one in my household was displaced due to no-fault or nonpayment-related eviction within the past seven years in Berkeley.",
        ],
      },
      {
        text: "Displacement due to Foreclosure",
        options: [
          "Someone in my household already has a Foreclosure Displacement preference certificate.",
          "Someone in my household is applying for, or will apply for, a Foreclosure Displacement preference certificate.",
          "Nobody in my household has been displaced due to foreclosure.",
        ],
      },
      {
        text: "Residents or Former Residents of Redlined Neighborhoods",
        options: [
          "I or a member of my household live or lived in a formerly redlined neighborhood in Berkeley.",
          "No one in my household lives or formerly lived in a redlined neighborhood.",
        ],
      },
      {
        text: "Descendants of Residents of Redlined Neighborhoods",
        options: [
          "At least one of my parents or grandparents lives or lived in a formerly redlined neighborhood in Berkeley",
          "I do not qualify for this preference",
        ],
      },
      {
        text: "Homeless or at Risk of Homelessness",
        options: [
          "I, or someone in my household, live in Berkeley, and I have somewhere to stay, but it isn't permanent.",
          "I, or someone in my household, am/is homeless and living in Berkeley, or am homeless and had a previous address in Berkeley.",
          "I do not qualify for this preference.",
        ],
      },
      {
        text: "Berkeley Housing Authority Preference",
        options: [
          "My household lives in the City of Berkeley or formerly lived in the City of Berkeley; or someone in my household works in the City of Berkeley or has been hired to work in the City of Berkeley",
          "I or a member of my household is a veteran",
          "I or someone in my household is 62 years or older and/or disabled",
          "My household includes two or more people",
          "I don't want to be considered for this preference",
        ],
      },
    ],
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    // get application id, language, program, preference where application language was not english
    const applications = await queryRunner.query(`
        SELECT
            a.id,
            a.language,
            a.preferences
        FROM applications a
        WHERE (a.programs != '[]')
            AND a.language != 'en'
            AND a.listing_id = '123f4226-3f3d-4311-9e54-49e47ecfb068'
        ORDER BY a.created_at desc
    `)

    const promiseArray: Promise<any>[] = []
    for (const app of applications) {
      promiseArray.push(this.untranslate(app, queryRunner))
    }
    await Promise.all(promiseArray)
  }

  public untranslateHelper(dataSet: any[]) {
    return dataSet.map((preference) => {
      const englishPreference = this.listingPrefencesTranslations.en.find(
        (translation) => translation.text === preference.key
      )
      const options = preference.options.map((option, index) => {
        const newOption = { ...option, key: englishPreference.options[index] }
        return newOption
      })
      return { ...preference, options: options }
    })
  }

  public untranslate(app: any, queryRunner: QueryRunner) {
    const updatePreferences = this.untranslateHelper(app.preferences)

    return queryRunner.query(
      `
        UPDATE applications
        SET preferences = $1
        WHERE id = $2
      `,
      [JSON.stringify(updatePreferences), app.id]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
