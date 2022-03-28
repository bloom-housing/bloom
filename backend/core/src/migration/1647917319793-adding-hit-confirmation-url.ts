import { MigrationInterface, QueryRunner } from "typeorm"

export class addingHitConfirmationUrl1647917319793 implements MigrationInterface {
  name = "addingHitConfirmationUrl1647917319793"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD "hit_confirmation_url" TIMESTAMP WITH TIME ZONE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "hit_confirmation_url"`)
  }
}
