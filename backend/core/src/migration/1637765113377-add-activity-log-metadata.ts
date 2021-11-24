import { MigrationInterface, QueryRunner } from "typeorm"

export class addActivityLogMetadata1637765113377 implements MigrationInterface {
  name = "addActivityLogMetadata1637765113377"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "activity_logs" ADD "metadata" character varying`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "activity_logs" DROP COLUMN "metadata"`)
  }
}
