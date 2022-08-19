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
      `ALTER TABLE "application_flagged_set" ADD "rule_key" character varying NOT NULL`
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
    for (const afsa of afsas) {
      const applicant = await queryRunner.query(
        `
        SELECT applicant.email_address, applicant.first_name, applicant.last_name, applicant.birth_month, applicant.birth_day, applicant.birth_year 
        FROM applicant
        INNER JOIN applications on applications.applicant_id = applicant.id
        WHERE applications.id = $1
      `,
        [afsa.applications_id]
      )

      let ruleKey: String | null = null

      // get application info needed for key
      if (afsas.rule === Rule.email) {
        ruleKey = `${afsas.lisitng_id}-email-${applicant.email_address}`
      } else if (afsas.rule === Rule.nameAndDOB) {
        ruleKey =
          `${afsas.listing_id}-nameAndDOB-${applicant.first_name}-${applicant.last_name}-${applicant.birth_month}-` +
          `${applicant.birth_day}-${applicant.birth_year}`
      }

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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "last_application_update_at"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "afs_last_run_at"`)
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" DROP CONSTRAINT "UQ_2983d3205a16bfae28323d021ea"`
    )
    await queryRunner.query(`ALTER TABLE "application_flagged_set" DROP COLUMN "rule_key"`)
  }
}
