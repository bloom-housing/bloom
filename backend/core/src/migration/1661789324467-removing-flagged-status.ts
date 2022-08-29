import { MigrationInterface, QueryRunner } from "typeorm"

export class removingFlaggedStatus1661789324467 implements MigrationInterface {
  name = "removingFlaggedStatus1661789324467"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "application_flagged_set" DROP COLUMN "status"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" ADD "status" character varying NOT NULL DEFAULT 'flagged'`
    )
  }
}
