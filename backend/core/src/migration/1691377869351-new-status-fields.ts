import { MigrationInterface, QueryRunner } from "typeorm"

export class newStatusFields1691377869351 implements MigrationInterface {
  name = "newStatusFields1691377869351"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."listings_status_enum" ADD VALUE 'changesRequested'`
    )
    await queryRunner.query(`ALTER TYPE "public"."listings_status_enum" ADD VALUE 'pendingReview'`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."listings_status_enum_old" AS ENUM('active', 'pending', 'closed')`
    )
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "status" DROP DEFAULT`)
    await queryRunner.query(
      `ALTER TABLE "listings" ALTER COLUMN "status" TYPE "public"."listings_status_enum_old" USING "status"::"text"::"public"."listings_status_enum_old"`
    )
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "status" SET DEFAULT 'pending'`)
    await queryRunner.query(`DROP TYPE "public"."listings_status_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."listings_status_enum_old" RENAME TO "listings_status_enum"`
    )
  }
}
