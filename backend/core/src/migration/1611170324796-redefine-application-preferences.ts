import { MigrationInterface, QueryRunner } from "typeorm"

export class redefineApplicationPreferences1611170324796 implements MigrationInterface {
  name = "redefineApplicationPreferences1611170324796"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_94732707236694795230ad64c78"`
    )
    await queryRunner.query(
      `CREATE TABLE "application_preference" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "data" jsonb, "application_id" uuid, "preference_id" uuid, CONSTRAINT "PK_e24d88ff86742179cf93434fcae" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "UQ_94732707236694795230ad64c78"`
    )
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "preferences_id"`)
    await queryRunner.query(
      `ALTER TABLE "application_preference" ADD CONSTRAINT "FK_3a650c5299b1063f57bf6a2422e" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "application_preference" ADD CONSTRAINT "FK_fb3200f0f8c9469aee290c37158" FOREIGN KEY ("preference_id") REFERENCES "preferences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application_preference" DROP CONSTRAINT "FK_fb3200f0f8c9469aee290c37158"`
    )
    await queryRunner.query(
      `ALTER TABLE "application_preference" DROP CONSTRAINT "FK_3a650c5299b1063f57bf6a2422e"`
    )
    await queryRunner.query(`ALTER TABLE "applications" ADD "preferences_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "UQ_94732707236694795230ad64c78" UNIQUE ("preferences_id")`
    )
    await queryRunner.query(`DROP TABLE "application_preference"`)
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_94732707236694795230ad64c78" FOREIGN KEY ("preferences_id") REFERENCES "application_preferences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
