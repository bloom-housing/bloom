import { MigrationInterface, QueryRunner } from "typeorm"

export class marketingSeason1649374032458 implements MigrationInterface {
  name = "marketingSeason1649374032458"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "listings_marketing_season_enum" AS ENUM('spring', 'summer', 'fall', 'winter')`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "marketing_season" "listings_marketing_season_enum"`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "marketing_season"`)
    await queryRunner.query(`DROP TYPE "listings_marketing_season_enum"`)
  }
}
