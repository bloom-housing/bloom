import { MigrationInterface, QueryRunner } from "typeorm"

export class reservedCommunityDescription1626804878532 implements MigrationInterface {
  name = "reservedCommunityDescription1626804878532"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" ADD "reserved_community_description" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "reserved_community_description"`)
  }
}
