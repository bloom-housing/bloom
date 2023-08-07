import { MigrationInterface, QueryRunner } from "typeorm"

export class requestedChangesFields1691435215911 implements MigrationInterface {
  name = "requestedChangesFields1691435215911"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" ADD "requested_changes" text`)
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "requested_changes_date" TIMESTAMP WITH TIME ZONE`
    )
    await queryRunner.query(`ALTER TABLE "listings" ADD "requested_changes_user_id" uuid`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "requested_changes_user_id"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "requested_changes_date"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "requested_changes"`)
  }
}
