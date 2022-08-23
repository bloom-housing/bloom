import { MigrationInterface, QueryRunner } from "typeorm"
import https from "https"

export class multiselectQuestion1658871879940 implements MigrationInterface {
  name = "multiselectQuestion1658871879940"
  translations = {}

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."multiselect_questions_application_section_enum" AS ENUM('programs', 'preferences')`
    )
    await queryRunner.query(
      `CREATE TABLE "multiselect_questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "text" text NOT NULL, "sub_text" text, "description" text, "links" jsonb, "options" jsonb, "opt_out_text" text, "hide_from_listing" boolean, "application_section" "public"."multiselect_questions_application_section_enum" NOT NULL, CONSTRAINT "PK_671931eccff7fb3b7cf2050cce0" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "listing_multiselect_questions" ("ordinal" integer, "listing_id" uuid NOT NULL, "multiselect_question_id" uuid NOT NULL, CONSTRAINT "PK_42d86daebffadee893f602506c2" PRIMARY KEY ("listing_id", "multiselect_question_id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "jurisdictions_multiselect_questions_multiselect_questions" ("jurisdictions_id" uuid NOT NULL, "multiselect_questions_id" uuid NOT NULL, CONSTRAINT "PK_b43958a0ef8fbfef97db9c23f8f" PRIMARY KEY ("jurisdictions_id", "multiselect_questions_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_3f7126f5da7c0368aea2f9459c" ON "jurisdictions_multiselect_questions_multiselect_questions" ("jurisdictions_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ab91e5d403a6cf21656f7d5ae2" ON "jurisdictions_multiselect_questions_multiselect_questions" ("multiselect_questions_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "FK_d123697625fe564c2bae54dcecf" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "FK_92adcb35f2f14e316b4cb12a84e" FOREIGN KEY ("multiselect_question_id") REFERENCES "multiselect_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions" ADD CONSTRAINT "FK_3f7126f5da7c0368aea2f9459c0" FOREIGN KEY ("jurisdictions_id") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions" ADD CONSTRAINT "FK_ab91e5d403a6cf21656f7d5ae20" FOREIGN KEY ("multiselect_questions_id") REFERENCES "multiselect_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )

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

    // begin migration from prefences
    const preferences = await queryRunner.query(`
            SELECT 
                p.id,
                p.created_at,
                p.updated_at,
                p.title,
                p.subtitle,
                p.description,
                p.links,
                p.form_metadata
            FROM preferences p
        `)

    for (let i = 0; i < preferences.length; i++) {
      const pref = preferences[i]
      const jurisInfo = await queryRunner.query(`
            SELECT
              j.id,
              j.name
            FROM jurisdictions_preferences_preferences jp
              JOIN jurisdictions j ON jp.jurisdictions_id = j.id
            LIMIT 1
        `)
      const { optOutText, options } = this.resolveOptionValues(
        pref.form_metadata,
        "preferences",
        jurisInfo?.length ? jurisInfo[0].name : ""
      )
      const res = await queryRunner.query(`
          INSERT INTO multiselect_questions (
              created_at,
              updated_at,
              text,
              sub_text,
              description,
              links,
              hide_from_listing,
              opt_out_text,
              options,
              application_section
          )
          SELECT 
              '${new Date(pref.created_at).toISOString()}',
              '${new Date(pref.updated_at).toISOString()}',
              '${this.handleQuotes(pref.title)}',
              '${this.handleQuotes(pref.subtitle)}',
              '${this.handleQuotes(pref.description)}',
              ${pref.links ? `'${JSON.stringify(pref.links)}'` : "null"},
              ${this.resolveHideFromListings(pref)},
              ${optOutText ? `'${this.handleQuotes(optOutText)}'` : "null"},
              ${options},
              'preferences'
          RETURNING id
      `)
      await queryRunner.query(`
          INSERT INTO jurisdictions_multiselect_questions_multiselect_questions(multiselect_questions_id, jurisdictions_id)
          SELECT
            '${res[0].id}',
            jp.jurisdictions_id
          FROM jurisdictions_preferences_preferences jp 
          WHERE jp.preferences_id = '${pref.id}';
      
          INSERT INTO listing_multiselect_questions(ordinal, multiselect_question_id, listing_id)
          SELECT
              ordinal,
              '${res[0].id}',
              listing_id
          FROM listing_preferences
          WHERE preference_id = '${pref.id}';
      `)
    }

    // begin migration from programs
    const programs = await queryRunner.query(`
      SELECT 
          p.id,
          p.created_at,
          p.updated_at,
          p.title,
          p.subtitle,
          p.description,
          p.form_metadata
      FROM programs p
    `)

    for (let i = 0; i < programs.length; i++) {
      const prog = programs[i]
      const jurisInfo = await queryRunner.query(`
            SELECT
              j.id,
              j.name
            FROM jurisdictions_programs_programs jp
              JOIN jurisdictions j ON jp.jurisdictions_id = j.id
            LIMIT 1
        `)

      const { optOutText, options } = this.resolveOptionValues(
        prog.form_metadata,
        "programs",
        jurisInfo?.length ? jurisInfo[0].name : ""
      )
      const res = await queryRunner.query(`
          INSERT INTO multiselect_questions (
              created_at,
              updated_at,
              text,
              sub_text,
              description,
              links,
              hide_from_listing,
              opt_out_text,
              options,
              application_section
          )
          SELECT
              '${new Date(prog.created_at).toISOString()}',
              '${new Date(prog.updated_at).toISOString()}',
              '${this.handleQuotes(prog.title)}',
              '${this.handleQuotes(prog.subtitle)}',
              '${this.handleQuotes(prog.description)}',
              null,
              ${this.resolveHideFromListings(prog)},
              ${optOutText ? `'${this.handleQuotes(optOutText)}'` : "null"},
              ${options},
              'programs'
          RETURNING id
      `)

      await queryRunner.query(`
          INSERT INTO jurisdictions_multiselect_questions_multiselect_questions(multiselect_questions_id, jurisdictions_id)
          SELECT
              '${res[0].id}',
              jp.jurisdictions_id
          FROM jurisdictions_programs_programs jp
          WHERE jp.programs_id = '${prog.id}';

          INSERT INTO listing_multiselect_questions(ordinal, multiselect_question_id, listing_id)
          SELECT
              ordinal,
              '${res[0].id}',
              listing_id
          FROM listing_programs
          WHERE program_id = '${prog.id}';
      `)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions" DROP CONSTRAINT "FK_ab91e5d403a6cf21656f7d5ae20"`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions" DROP CONSTRAINT "FK_3f7126f5da7c0368aea2f9459c0"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "FK_92adcb35f2f14e316b4cb12a84e"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "FK_d123697625fe564c2bae54dcecf"`
    )
    await queryRunner.query(`DROP INDEX "public"."IDX_ab91e5d403a6cf21656f7d5ae2"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_3f7126f5da7c0368aea2f9459c"`)
    await queryRunner.query(
      `DROP TABLE "jurisdictions_multiselect_questions_multiselect_questions"`
    )
    await queryRunner.query(`DROP TABLE "listing_multiselect_questions"`)
    await queryRunner.query(`DROP TABLE "multiselect_questions"`)
    await queryRunner.query(`DROP TYPE "public"."multiselect_questions_application_section_enum"`)
  }

  private resolveHideFromListings(pref): string {
    if ("hideFromListing" in pref.form_metadata) {
      if (pref.form_metadata.hideFromListing) {
        return "true"
      }
      return "false"
    }
    return "null"
  }

  private resolveOptionValues(formMetaData, type, juris) {
    let optOutText = null
    const options = []
    let shouldPush = true

    formMetaData.options.forEach((option, index) => {
      const toPush: Record<string, any> = {
        ordinal: index,
        text: this.getTranslated(
          type,
          formMetaData.key,
          option.key === "preferNotToSay" ? "preferNotToSay" : `${option.key}.label`,
          juris
        ),
      }

      if (
        option.exclusive &&
        (formMetaData.hideGenericDecline || formMetaData.type === "checkbox") &&
        index !== formMetaData.options.length - 1
      ) {
        // for all but the last exlusive option push into options array
        toPush.exclusive = true
      } else if (
        option.exclusive &&
        (formMetaData.hideGenericDecline || formMetaData.type === "checkbox") &&
        index === formMetaData.options.length - 1
      ) {
        // for the last exclusive option add as optOutText
        optOutText = this.getTranslated(
          type,
          formMetaData.key,
          option.key === "preferNotToSay" ? "preferNotToSay" : `${option.key}.label`,
          juris
        )
        shouldPush = false
      }

      if (option.description) {
        toPush.description = this.getTranslated(
          type,
          formMetaData.key,
          option.key === "preferNotToSay" ? "preferNotToSay" : `${option.key}.description`,
          juris
        )
      }

      if (option?.extraData.some((extraData) => extraData.type === "address")) {
        toPush.collectAddress = true
      }

      if (shouldPush) {
        options.push(toPush)
      } else {
        shouldPush = true
      }
    })

    return { optOutText, options: options.length ? `'${JSON.stringify(options)}'` : "null" }
  }

  private getTranslated(type, prefKey, translationKey, juris) {
    let searchKey = `application.${type}.${prefKey}.${translationKey}`
    if (translationKey === "preferNotToSay") {
      searchKey = "t.preferNotToSay"
    }

    if (juris === "Detroit") {
      if (this.translations["detroitPublic"][searchKey]) {
        return this.handleQuotes(this.translations["detroitPublic"][searchKey])
      } else if (this.translations["detroitPartners"][searchKey]) {
        return this.handleQuotes(this.translations["detroitPartners"][searchKey])
      } else if (this.translations["detroitCore"][searchKey]) {
        return this.handleQuotes(this.translations["detroitCore"][searchKey])
      }
    } else if (["Alameda", "San Mateo", "San Jose"].includes(juris)) {
      if (juris === "Alameda" && this.translations["alamedaPublic"][searchKey]) {
        return this.handleQuotes(this.translations["alamedaPublic"][searchKey])
      } else if (juris === "San Mateo" && this.translations["smcPublic"][searchKey]) {
        return this.handleQuotes(this.translations["smcPublic"][searchKey])
      } else if (juris === "San Jose" && this.translations["sjPublic"][searchKey]) {
        return this.handleQuotes(this.translations["sjPublic"][searchKey])
      } else if (this.translations["hbaPublic"][searchKey]) {
        return this.handleQuotes(this.translations["hbaPublic"][searchKey])
      } else if (this.translations["hbaPartners"][searchKey]) {
        return this.handleQuotes(this.translations["hbaPartners"][searchKey])
      } else if (this.translations["hbaCore"][searchKey]) {
        return this.handleQuotes(this.translations["hbaCore"][searchKey])
      }
    }

    if (this.translations["generalPublic"][searchKey]) {
      return this.handleQuotes(this.translations["generalPublic"][searchKey])
    } else if (this.translations["generalPartners"][searchKey]) {
      return this.handleQuotes(this.translations["generalPartners"][searchKey])
    } else if (this.translations["generalCore"][searchKey]) {
      return this.handleQuotes(this.translations["generalCore"][searchKey])
    }
    return "no translation"
  }

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

  private handleQuotes(str) {
    if (!str) {
      return str
    }
    const regEx = new RegExp("'", "g")
    return str.replace(regEx, "''")
  }
}
