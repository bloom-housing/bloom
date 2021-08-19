import { MigrationInterface, QueryRunner } from "typeorm"

export class changeWhatToExpectToString1629220482499 implements MigrationInterface {
  name = "changeWhatToExpectToString1629220482499"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "what_to_expect"`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "what_to_expect" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "what_to_expect"`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "what_to_expect" jsonb`)
  }
}
