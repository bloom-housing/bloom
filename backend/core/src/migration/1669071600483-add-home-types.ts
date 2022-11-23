import { MigrationInterface, QueryRunner } from "typeorm"

export class addHomeTypes1669071600483 implements MigrationInterface {
  name = "addHomeTypes1669071600483"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."listings_home_type_enum" AS ENUM('apartment', 'duplex', 'house', 'townhome')`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "home_type" "public"."listings_home_type_enum"`
    )
    await queryRunner.query(`UPDATE "listings" SET "home_type" = 'apartment'`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "home_type"`)
    await queryRunner.query(`DROP TYPE "public"."listings_home_type_enum"`)
  }
}
