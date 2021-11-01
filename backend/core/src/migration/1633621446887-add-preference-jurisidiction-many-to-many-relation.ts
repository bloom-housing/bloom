import { MigrationInterface, QueryRunner } from "typeorm"
import { query } from "express"
import { CountyCode } from "../shared/types/county-code"

export class addPreferenceJurisidictionManyToManyRelation1633621446887
  implements MigrationInterface {
  name = "addPreferenceJurisidictionManyToManyRelation1633621446887"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "jurisdictions_preferences_preferences" ("jurisdictions_id" uuid NOT NULL, "preferences_id" uuid NOT NULL, CONSTRAINT "PK_e5e8a8e6f1d02a2e228444aef76" PRIMARY KEY ("jurisdictions_id", "preferences_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_46e20b8b62dbdabfd76955e95b" ON "jurisdictions_preferences_preferences" ("jurisdictions_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_7a0eef07c822800c4e9b9d4361" ON "jurisdictions_preferences_preferences" ("preferences_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_preferences_preferences" ADD CONSTRAINT "FK_46e20b8b62dbdabfd76955e95b1" FOREIGN KEY ("jurisdictions_id") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_preferences_preferences" ADD CONSTRAINT "FK_7a0eef07c822800c4e9b9d43619" FOREIGN KEY ("preferences_id") REFERENCES "preferences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    // Assign all existing preferences to Alameda  jurisdiction
    const [{ id: alamedaJurisdictionId }] = await queryRunner.query(
      `SELECT id FROM jurisdictions where name = '${CountyCode.alameda}'`
    )
    const preferences: [{ id: string }] = await queryRunner.query(`SELECT id FROM preferences`)
    for (const preference of preferences) {
      await queryRunner.query(
        `INSERT INTO jurisdictions_preferences_preferences (jurisdictions_id, preferences_id) VALUES ($1, $2)`,
        [alamedaJurisdictionId, preference.id]
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_preferences_preferences" DROP CONSTRAINT "FK_7a0eef07c822800c4e9b9d43619"`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_preferences_preferences" DROP CONSTRAINT "FK_46e20b8b62dbdabfd76955e95b1"`
    )
    await queryRunner.query(`DROP INDEX "IDX_7a0eef07c822800c4e9b9d4361"`)
    await queryRunner.query(`DROP INDEX "IDX_46e20b8b62dbdabfd76955e95b"`)
    await queryRunner.query(`DROP TABLE "jurisdictions_preferences_preferences"`)
  }
}
