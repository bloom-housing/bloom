import { MigrationInterface, QueryRunner } from "typeorm"

export class applicationDueTime1625094786618 implements MigrationInterface {
  name = "applicationDueTime1625094786618"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "application_due_time" TIMESTAMP WITH TIME ZONE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_due_time"`)
  }
}
