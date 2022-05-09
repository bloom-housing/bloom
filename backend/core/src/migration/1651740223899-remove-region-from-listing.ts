import { MigrationInterface, QueryRunner } from "typeorm"

export class removeRegionFromListing1651740223899 implements MigrationInterface {
  name = "removeRegionFromListing1651740223899"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "region"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" ADD "region" text`)
  }
}
