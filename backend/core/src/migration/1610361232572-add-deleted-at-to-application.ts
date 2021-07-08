import { MigrationInterface, QueryRunner } from "typeorm"

export class addDeletedAtToApplication1610361232572 implements MigrationInterface {
  name = "addDeletedAtToApplication1610361232572"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applications" ADD "deleted_at" TIMESTAMP`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "deleted_at"`)
  }
}
