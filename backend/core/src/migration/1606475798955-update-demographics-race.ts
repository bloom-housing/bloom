import { MigrationInterface, QueryRunner } from "typeorm"

export class updateDemographicsRace1606475798955 implements MigrationInterface {
  name = "updateDemographicsRace1606475798955"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "demographics" DROP COLUMN "race"`)
    await queryRunner.query(`ALTER TABLE "demographics" ADD "race" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "demographics" DROP COLUMN "race"`)
    await queryRunner.query(`ALTER TABLE "demographics" ADD "race" character varying NOT NULL`)
  }
}
