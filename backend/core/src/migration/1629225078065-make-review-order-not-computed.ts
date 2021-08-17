import { MigrationInterface, QueryRunner } from "typeorm"

export class makeReviewOrderNotComputed1629225078065 implements MigrationInterface {
  name = "makeReviewOrderNotComputed1629225078065"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "listings_review_order_type_enum" AS ENUM('lottery', 'firstComeFirstServe')`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "review_order_type" "listings_review_order_type_enum"`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "review_order_type"`)
    await queryRunner.query(`DROP TYPE "listings_review_order_type_enum"`)
  }
}
