import { MigrationInterface, QueryRunner } from "typeorm"

export class addUserPreferences1636490631999 implements MigrationInterface {
  name = "addUserPreferences1636490631999"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_preferences" ("send_email_notifications" boolean NOT NULL DEFAULT false, "send_sms_notifications" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, CONSTRAINT "REL_458057fa75b66e68a275647da2" UNIQUE ("user_id"), CONSTRAINT "PK_458057fa75b66e68a275647da2e" PRIMARY KEY ("user_id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_458057fa75b66e68a275647da2e" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_458057fa75b66e68a275647da2e"`
    )
    await queryRunner.query(`DROP TABLE "user_preferences"`)
  }
}
