import { MigrationInterface, QueryRunner } from "typeorm"

export class removeApplicationDueTime1641855882656 implements MigrationInterface {
  name = "removeApplicationDueTime1641855882656"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_due_time"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "application_due_time" TIMESTAMP WITH TIME ZONE`
    )
  }
}
