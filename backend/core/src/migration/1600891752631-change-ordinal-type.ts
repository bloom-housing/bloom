import { MigrationInterface, QueryRunner } from "typeorm"

export class changeOrdinalType1600891752631 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preferences" ALTER COLUMN "ordinal" TYPE numeric USING (LEFT(ordinal,1)::NUMERIC)`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "preferences" ALTER COLUMN "ordinal" TYPE text`)
  }
}
