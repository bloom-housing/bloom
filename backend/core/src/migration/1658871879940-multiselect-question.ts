import { MigrationInterface, QueryRunner } from "typeorm"
// importing these causes issue with build command compiling to dist, because it changes the expected structure, so we need to find an alternative to providing these
/* import generalTranslations from "../../../../ui-components/src/locales/general.json"
import partnerTranslations from "../../../../sites/partners/page_content/locale_overrides/general.json"
import publicTranslations from "../../../../sites/public/page_content/locale_overrides/general.json" */

export class multiselectQuestion1658871879940 implements MigrationInterface {
  name = "multiselectQuestion1658871879940"

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
      `ALTER TABLE "jurisdictions" ALTER COLUMN "enable_accessibility_features" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ALTER COLUMN "enable_utilities_included" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_e5d5291cd6ab92cbec304aab905"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "UQ_e5d5291cd6ab92cbec304aab905" UNIQUE ("building_address_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "FK_d123697625fe564c2bae54dcecf" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "FK_92adcb35f2f14e316b4cb12a84e" FOREIGN KEY ("multiselect_question_id") REFERENCES "multiselect_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_e5d5291cd6ab92cbec304aab905" FOREIGN KEY ("building_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions" ADD CONSTRAINT "FK_3f7126f5da7c0368aea2f9459c0" FOREIGN KEY ("jurisdictions_id") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions" ADD CONSTRAINT "FK_ab91e5d403a6cf21656f7d5ae20" FOREIGN KEY ("multiselect_questions_id") REFERENCES "multiselect_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )

    // begin migration from prefences
    const preferences = await queryRunner.query(`
            SELECT 
                p.created_at,
                p.updated_at,
                p.title,
                p.subtitle,
                p.description,
                p.links,
                p.form_metadata,
                j.name,
                j.id
            FROM preferences p
                LEFT JOIN jurisdictions_preferences_preferences jp ON jp.preferences_id = p.id
                LEFT JOIN jurisdictions j ON j.id = jp.jurisdictions_id
        `)

    for (let i = 0; i < preferences.length; i++) {
      const pref = preferences[i]
      const { optOutText, options } = this.resolveOptionValues(pref.form_metadata, "preferences")
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
                '${pref.title}',
                '${pref.subtitle}',
                '${pref.description}',
                ${pref.links ? "'pref.links'" : "null"},
                ${this.resolveHideFromListings(pref)},
                ${optOutText},
                ${options},
                'preferences'
            RETURNING id
        `)

      await queryRunner.query(`
            INSERT INTO jurisdictions_multiselect_questions_multiselect_questions(multiselect_questions_id, jurisdictions_id)
            SELECT
                '${res[0].id}',
                '${pref.id}';
            
            INSERT INTO listing_multiselect_questions(multiselect_question_id, listing_id)
            SELECT
                '${res[0].id}',
                listing_id
            FROM listing_preferences
            WHERE preference_id = '${pref.id}';
        `)
    }

    // begin migration from programs
    const programs = await queryRunner.query(`
            SELECT 
                p.created_at,
                p.updated_at,
                p.title,
                p.subtitle,
                p.description,
                p.form_metadata,
                j.name,
                j.id
            FROM programs p
                LEFT JOIN jurisdictions_programs_programs jp ON jp.programs_id = p.id
                LEFT JOIN jurisdictions j ON j.id = jp.jurisdictions_id
        `)
    console.log("133:", programs)
    for (let i = 0; i < programs.length; i++) {
      const prog = programs[i]
      const { optOutText, options } = this.resolveOptionValues(prog.form_metadata, "programs")
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
                    '${prog.title}',
                    '${prog.subtitle}',
                    '${prog.description}',
                    null,
                    ${this.resolveHideFromListings(prog)},
                    ${optOutText},
                    ${options},
                    'programs'
                RETURNING id
            `)

      await queryRunner.query(`
                INSERT INTO jurisdictions_multiselect_questions_multiselect_questions(multiselect_questions_id, jurisdictions_id)
                SELECT
                    '${res[0].id}',
                    '${prog.id}';
                
                INSERT INTO listing_multiselect_questions(multiselect_question_id, listing_id)
                SELECT
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
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_e5d5291cd6ab92cbec304aab905"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "FK_92adcb35f2f14e316b4cb12a84e"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "FK_d123697625fe564c2bae54dcecf"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "UQ_e5d5291cd6ab92cbec304aab905"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_e5d5291cd6ab92cbec304aab905" FOREIGN KEY ("building_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ALTER COLUMN "enable_utilities_included" SET DEFAULT false`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ALTER COLUMN "enable_accessibility_features" SET DEFAULT false`
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

  private resolveOptionValues(formMetaData, type) {
    let optOutText = "null"
    const options = []
    let shouldPush = true

    formMetaData.options.forEach((option, index) => {
      const toPush: Record<string, any> = {
        ordinal: index,
        text: this.getTranslated(type, formMetaData.key, `${option.key}.label`),
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
        optOutText = this.getTranslated(type, formMetaData.key, `${option.key}.label`)
        shouldPush = false
      }

      if (option.description) {
        toPush.description = this.getTranslated(type, formMetaData.key, `${option.key}.description`)
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

  private getTranslated(type = "preferences", prefKey, translationKey) {
    const searchKey = `application.${type}.${prefKey}.${translationKey}`

    /* if (publicTranslations[searchKey]) {
      return publicTranslations[searchKey]
    } else if (partnerTranslations[searchKey]) {
      return partnerTranslations[searchKey]
    } else if (generalTranslations[searchKey]) {
      return generalTranslations[searchKey]
    } */
    return "no translation"
  }
}
