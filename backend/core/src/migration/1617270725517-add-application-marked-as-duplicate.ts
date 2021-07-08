import { MigrationInterface, QueryRunner } from "typeorm"

export class addApplicationMarkedAsDuplicate1617270725517 implements MigrationInterface {
  name = "addApplicationMarkedAsDuplicate1617270725517"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applications" ADD "marked_as_duplicate" boolean NOT NULL DEFAULT false`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "marked_as_duplicate"`)
  }
}
