import { MigrationInterface, QueryRunner } from "typeorm"

export class updateApplicationEntity1606477233962 implements MigrationInterface {
  name = "updateApplicationEntity1606477233962"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applications" ADD "status" character varying NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applications" ADD "preferences_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "UQ_94732707236694795230ad64c78" UNIQUE ("preferences_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_94732707236694795230ad64c78" FOREIGN KEY ("preferences_id") REFERENCES "application_preferences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_94732707236694795230ad64c78"`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "UQ_94732707236694795230ad64c78"`
    )
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "preferences_id"`)
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "status"`)
  }
}
