import { MigrationInterface, QueryRunner } from "typeorm"

export class allowMultipleRaceCheckboxes1635535204972 implements MigrationInterface {
  name = "allowMultipleRaceCheckboxes1635535204972"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const existingRaceFields = await queryRunner.query(`SELECT id, race FROM demographics`)

    await queryRunner.query(`ALTER TABLE "demographics" DROP COLUMN "race"`)
    await queryRunner.query(`ALTER TABLE "demographics" ADD "race" text array`)

    for (const demographic in existingRaceFields) {
      await queryRunner.query(`UPDATE demographics SET race = ($1) WHERE id = ($2)`, [
        [existingRaceFields[demographic]["race"]],
        existingRaceFields[demographic]["id"],
      ])
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const existingRaceFields = await queryRunner.query(`SELECT id, race FROM demographics`)

    await queryRunner.query(`ALTER TABLE "demographics" DROP COLUMN "race"`)
    await queryRunner.query(`ALTER TABLE "demographics" ADD "race" text`)

    for (const demographic in existingRaceFields) {
      await queryRunner.query(`UPDATE demographics race = ($1) WHERE id = ($2)`, [
        existingRaceFields[demographic]["race"][0],
        existingRaceFields[demographic]["id"],
      ])
    }
  }
}
