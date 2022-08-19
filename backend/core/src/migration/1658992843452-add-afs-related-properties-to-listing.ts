import { MigrationInterface, QueryRunner } from "typeorm"
import { Rule } from "../application-flagged-sets/types/rule-enum"

export class addAfsRelatedPropertiesToListing1658992843452 implements MigrationInterface {
  name = "addAfsRelatedPropertiesToListing1658992843452"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "afs_last_run_at" TIMESTAMP WITH TIME ZONE DEFAULT '1970-01-01'`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "last_application_update_at" TIMESTAMP WITH TIME ZONE DEFAULT '1970-01-01'`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" ADD "rule_key" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" ADD CONSTRAINT "UQ_2983d3205a16bfae28323d021ea" UNIQUE ("rule_key")`
    )

    // set rule_key for existing afses
    const afsas = await queryRunner.query(`
      SELECT afsas.application_flagged_set_id, afsas.applications_id, afs.listing_id, afs.rule, afs.rule_key
      FROM application_flagged_set_applications_applications afsas
      INNER JOIN application_flagged_set afs ON afs.id = afsas.application_flagged_set_id
      WHERE afs.rule_key IS NULL
    `)

    const ruleKeyMap: { [key: string]: number } = {}

    for (const afsa of afsas) {
      const [applicant] = await queryRunner.query(
        `
        SELECT applicant.email_address, applicant.first_name, applicant.last_name, applicant.birth_month, applicant.birth_day, applicant.birth_year 
        FROM applicant
        INNER JOIN applications on applications.applicant_id = applicant.id
        WHERE applications.id = $1
      `,
        [afsa.applications_id]
      )

      let ruleKey: string | null = null

      // get application info needed for key
      if (afsa.rule === Rule.email) {
        ruleKey = `${afsa.listing_id}-email-${applicant.email_address}`
      } else if (afsa.rule === Rule.nameAndDOB) {
        ruleKey =
          `${afsa.listing_id}-nameAndDOB-${applicant.first_name}-${applicant.last_name}-${applicant.birth_month}-` +
          `${applicant.birth_day}-${applicant.birth_year}`
      }

      // check if rule_key already exists, because their are existing duplicates
      const existingSets = await queryRunner.query(
        `
        SELECT id, rule_key
        FROM application_flagged_set
        WHERE rule_key = $1
        `,
        [ruleKey]
      )
      
      // update and delete the current set if the application_flagged_set ids are different
      if (existingSets.length && existingSets[0].id !== afsa.application_flagged_set_id) {
        const update = await queryRunner.query(
          `
          UPDATE application_flagged_set_applications_applications
          SET application_flagged_set_id = $1
          WHERE application_flagged_set_id = $2
          AND applications_id = $3
          `,
          [existingSets[0].id, afsas.application_flagged_set_id, afsa.applications_id]
        )

        await queryRunner.query(
          `
          DELETE FROM application_flagged_set WHERE id = $1
          `,
          [afsa.application_flagged_set_id]
        )
      } else {
        // set rule_key
        await queryRunner.query(
          `
          UPDATE application_flagged_set
          SET rule_key = $1
          WHERE id = $2`,
          [ruleKey, afsa.application_flagged_set_id]
        )
      }
    }

    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" ALTER COLUMN "rule_key" SET NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "last_application_update_at"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "afs_last_run_at"`)
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" DROP CONSTRAINT "UQ_2983d3205a16bfae28323d021ea"`
    )
    await queryRunner.query(`ALTER TABLE "application_flagged_set" DROP COLUMN "rule_key"`)
  }
}
