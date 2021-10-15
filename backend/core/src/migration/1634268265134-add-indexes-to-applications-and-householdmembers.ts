import { MigrationInterface, QueryRunner } from "typeorm"

export class addIndexesToApplicationsAndHouseholdmembers1634268265134
  implements MigrationInterface {
  name = "addIndexesToApplicationsAndHouseholdmembers1634268265134"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "csv_formatting_type"`)
    await queryRunner.query(
      `CREATE INDEX "IDX_520996eeecf9f6fb9425dc7352" ON "household_member" ("application_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_cc9d65c58d8deb0ef5353e9037" ON "applications" ("listing_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_f2ace84eebd770f1387b47e5e4" ON "application_flagged_set" ("listing_id") `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_f2ace84eebd770f1387b47e5e4"`)
    await queryRunner.query(`DROP INDEX "IDX_cc9d65c58d8deb0ef5353e9037"`)
    await queryRunner.query(`DROP INDEX "IDX_520996eeecf9f6fb9425dc7352"`)
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "csv_formatting_type" character varying NOT NULL DEFAULT 'basic'`
    )
  }
}
