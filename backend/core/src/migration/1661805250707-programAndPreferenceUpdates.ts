import { MigrationInterface, QueryRunner } from "typeorm"
import https from "https"

export class programAndPreferenceUpdates1661805250707 implements MigrationInterface {
  translations = {}
  public async up(queryRunner: QueryRunner): Promise<void> {
    // gather up translations
    const translationURLs = [
      {
        url:
          "https://raw.githubusercontent.com/bloom-housing/bloom/dev/ui-components/src/locales/general.json",
        key: "generalCore",
      },
      {
        url:
          "https://raw.githubusercontent.com/bloom-housing/bloom/dev/sites/partners/page_content/locale_overrides/general.json",
        key: "generalPartners",
      },
      {
        url:
          "https://raw.githubusercontent.com/bloom-housing/bloom/dev/sites/public/page_content/locale_overrides/general.json",
        key: "generalPublic",
      },
      {
        url:
          "https://raw.githubusercontent.com/housingbayarea/bloom/dev/ui-components/src/locales/general.json",
        key: "hbaCore",
      },
      {
        url:
          "https://raw.githubusercontent.com/housingbayarea/bloom/dev/sites/partners/page_content/locale_overrides/general.json",
        key: "hbaPartners",
      },
      {
        url:
          "https://raw.githubusercontent.com/housingbayarea/bloom/dev/sites/public/page_content/locale_overrides/general.json",
        key: "hbaPublic",
      },
      {
        url:
          "https://raw.githubusercontent.com/CityOfDetroit/bloom/dev/ui-components/src/locales/general.json",
        key: "detroitCore",
      },
      {
        url:
          "https://raw.githubusercontent.com/CityOfDetroit/bloom/dev/sites/partners/page_content/locale_overrides/general.json",
        key: "detroitPartners",
      },
      {
        url:
          "https://raw.githubusercontent.com/CityOfDetroit/bloom/dev/sites/public/page_content/locale_overrides/general.json",
        key: "detroitPublic",
      },
      {
        url:
          "https://raw.githubusercontent.com/housingbayarea/bloom/0.3_alameda/sites/public/page_content/locale_overrides/general.json",
        key: "alamedaPublic",
      },
      {
        url:
          "https://raw.githubusercontent.com/housingbayarea/bloom/0.3_smc/sites/public/page_content/locale_overrides/general.json",
        key: "smcPublic",
      },
      {
        url:
          "https://raw.githubusercontent.com/housingbayarea/bloom/san-jose/sites/public/page_content/locale_overrides/general.json",
        key: "sjPublic",
      },
    ]

    for (let i = 0; i < translationURLs.length; i++) {
      const { url, key } = translationURLs[i]
      this.translations[key] = await this.getTranslationFile(url)
    }

    // construct mapper table to make my life easier
    await queryRunner.query(`
        CREATE TABLE "multiselect_programs_preferences_mapper" (
            "multiselect_id" uuid NOT NULL,
            "program_or_preference_id" uuid NOT NULL,
            "application_section" "public"."multiselect_questions_application_section_enum" NOT NULL,
            "juris_name" text not null,
            "created_at" TIMESTAMP NOT NULL DEFAULT now()
        )`)

    // fill mapper table
    await queryRunner.query(`
        INSERT INTO multiselect_programs_preferences_mapper (multiselect_id, program_or_preference_id, application_section, juris_name)
        SELECT
            mq.id,
            p.id,
            'programs',
            (
                SELECT
                    j.name
                FROM jurisdictions_programs_programs jpp
                    LEFT JOIN jurisdictions j ON j.id = jpp.jurisdictions_id
                WHERE jpp.programs_id = p.id
                LIMIT 1
            ) as jurisName
        FROM multiselect_questions mq
            JOIN programs p ON p.title = mq.text
        WHERE mq.application_section = 'programs'
          AND exists (
            SELECT
                1
            FROM jurisdictions_programs_programs jpp
            WHERE jpp.programs_id = p.id
          )
        ;


        INSERT INTO multiselect_programs_preferences_mapper (multiselect_id, program_or_preference_id, application_section, juris_name)
        SELECT
            mq.id,
            p.id,
            'preferences',
            (
                SELECT
                    j.name
                FROM jurisdictions_preferences_preferences jpp
                    LEFT JOIN jurisdictions j ON j.id = jpp.jurisdictions_id
                WHERE jpp.preferences_id = p.id
                LIMIT 1
            ) as jurisName
        FROM multiselect_questions mq
            JOIN preferences p ON p.title = mq.text
        WHERE mq.application_section = 'preferences'
          AND exists (
            SELECT
                1
            FROM jurisdictions_preferences_preferences jpp
            WHERE jpp.preferences_id = p.id
          )
    `)

    await this.alterData(queryRunner, "program")
    await this.alterData(queryRunner, "preference")
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}

  private getTranslationFile(url) {
    return new Promise((resolve, reject) =>
      https
        .get(url, (res) => {
          let body = ""

          res.on("data", (chunk) => {
            body += chunk
          })

          res.on("end", () => {
            try {
              const json = JSON.parse(body)
              resolve(json)
            } catch (error) {
              console.error("on end error:", error.message)
              reject(`parsing broke: ${url}`)
            }
          })
        })
        .on("error", (error) => {
          console.error("on error error:", error.message)
          reject(`getting broke: ${url}`)
        })
    )
  }

  private getTranslated(type, prefKey, translationKey, juris) {
    let searchKey = `application.${type}.${prefKey}.${translationKey}`
    if (translationKey === "preferNotToSay") {
      searchKey = "t.preferNotToSay"
    }

    if (juris === "Detroit") {
      if (this.translations["detroitPublic"][searchKey]) {
        return this.translations["detroitPublic"][searchKey]
      } else if (this.translations["detroitPartners"][searchKey]) {
        return this.translations["detroitPartners"][searchKey]
      } else if (this.translations["detroitCore"][searchKey]) {
        return this.translations["detroitCore"][searchKey]
      }
    } else if (["Alameda", "San Mateo", "San Jose"].includes(juris)) {
      if (juris === "Alameda" && this.translations["alamedaPublic"][searchKey]) {
        return this.translations["alamedaPublic"][searchKey]
      } else if (juris === "San Mateo" && this.translations["smcPublic"][searchKey]) {
        return this.translations["smcPublic"][searchKey]
      } else if (juris === "San Jose" && this.translations["sjPublic"][searchKey]) {
        return this.translations["sjPublic"][searchKey]
      } else if (this.translations["hbaPublic"][searchKey]) {
        return this.translations["hbaPublic"][searchKey]
      } else if (this.translations["hbaPartners"][searchKey]) {
        return this.translations["hbaPartners"][searchKey]
      } else if (this.translations["hbaCore"][searchKey]) {
        return this.translations["hbaCore"][searchKey]
      }
    }

    if (this.translations["generalPublic"][searchKey]) {
      return this.translations["generalPublic"][searchKey]
    } else if (this.translations["generalPartners"][searchKey]) {
      return this.translations["generalPartners"][searchKey]
    } else if (this.translations["generalCore"][searchKey]) {
      return this.translations["generalCore"][searchKey]
    }
    return "no translation"
  }

  private isDataAllowed(listingData, listing_id, meta, type) {
    return listingData.some(
      (listingInfo) =>
        listingInfo.listing_id === listing_id && listingInfo[type] === meta.program_or_preference_id
    )
  }

  private async alterData(queryRunner, type) {
    // grab the meta info
    const metaData = await queryRunner.query(`
        SELECT
            p.form_metadata,
            mq.text,
            mppm.juris_name as jurisName,
            mppm.program_or_preference_id
        FROM multiselect_programs_preferences_mapper mppm
            LEFT JOIN ${type}s p ON p.id = mppm.program_or_preference_id
            LEFT JOIN multiselect_questions mq ON mq.id = mppm.multiselect_id
        WHERE mppm.application_section = '${type}s'
    `)

    // grab the application data
    const applicationData = await queryRunner.query(`
        SELECT
            id,
            ${type}s as data,
            listing_id
        FROM applications
        WHERE ${type}s IS NOT NULL AND ${type}s != '[]'
    `)

    // grab the listing data
    const listingData = await queryRunner.query(`
        SELECT
            listing_id,
            ${type}_id
        FROM listing_${type}s
    `)

    // make alterations
    for (let i = 0; i < applicationData.length; i++) {
      let { id, data, listing_id } = applicationData[i]

      data = data.reduce((acc, selection) => {
        const metaText = metaData.find((meta) => meta.text === selection.key)
        const metaKey = metaData.find((meta) => meta.form_metadata.key === selection.key)

        if (metaText) {
          // if found in the new multiselect column
          if (this.isDataAllowed(listingData, listing_id, metaText, `${type}_id`)) {
            acc.push(selection)
          }
        } else if (metaKey) {
          // if found in the old program/preference column
          if (this.isDataAllowed(listingData, listing_id, metaKey, `${type}_id`)) {
            acc.push({
              ...selection,
              key: metaKey.text,
              options: selection.options.map((opt) => {
                const toReturn = {
                  ...opt,
                }
                toReturn.key = this.getTranslated(
                  `${type}s`,
                  selection.key,
                  opt.key === "preferNotToSay" ? "preferNotToSay" : `${opt.key}.label`,
                  metaKey.jurisName
                )
                return toReturn
              }),
            })
          }
        } else {
          // if not found at all (to prevent data loss)
          acc.push(selection)
        }
        return acc
      }, [])

      await queryRunner.query(
        `
        UPDATE applications
        SET
            ${type}s = $1
        WHERE id = '${id}'
    `,
        [JSON.stringify(data)]
      )
    }
  }
}
