import { MigrationInterface, QueryRunner } from "typeorm"

export class depositHelperTextCreation1636499724052 implements MigrationInterface {
  name = "depositHelperTextCreation1636499724052"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" ADD "deposit_helper_text" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "deposit_helper_text"`)
  }
}
