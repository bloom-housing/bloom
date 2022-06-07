import { MigrationInterface, QueryRunner } from "typeorm"

export class regionRename1654549186207 implements MigrationInterface {
  name = "regionRename1654549186207"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`BEGIN TRANSACTION`)
    await queryRunner.query(`ALTER TYPE "property_region_enum" ADD VALUE 'Greater Downtown'`)
    await queryRunner.query(`COMMIT TRANSACTION`)
    await queryRunner.query(
      `UPDATE "property" SET "region" = 'Greater Downtown' WHERE "region" = 'Downtown'`
    )
    await queryRunner.query(
      `ALTER TYPE "property_region_enum" RENAME TO "property_region_enum_old"`
    )
    await queryRunner.query(
      `CREATE TYPE "property_region_enum" AS ENUM('Greater Downtown', 'Eastside', 'Southwest', 'Westside')`
    )
    await queryRunner.query(
      `ALTER TABLE "property" ALTER COLUMN "region" TYPE "property_region_enum" USING "region"::"text"::"property_region_enum"`
    )
    await queryRunner.query(`DROP TYPE "property_region_enum_old"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "property_region_enum_old" AS ENUM('Greater Downtown', 'Eastside', 'Midtown - New Center', 'Southwest', 'Westside')`
    )
    await queryRunner.query(
      `ALTER TABLE "property" ALTER COLUMN "region" TYPE "property_region_enum_old" USING "region"::"text"::"property_region_enum_old"`
    )
    await queryRunner.query(`DROP TYPE "property_region_enum"`)
    await queryRunner.query(
      `ALTER TYPE "property_region_enum_old" RENAME TO "property_region_enum"`
    )
  }
}
