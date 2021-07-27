import { MigrationInterface, QueryRunner } from "typeorm"

export class alterTranslationsTable1619094998058 implements MigrationInterface {
  name = "alterTranslationsTable1619094998058"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_4c17bc3d8eefdb8702bb24a2c5"`)
    await queryRunner.query(`ALTER TABLE "translations" DROP COLUMN "key"`)
    await queryRunner.query(`ALTER TABLE "translations" DROP COLUMN "text"`)
    await queryRunner.query(`ALTER TABLE "translations" ADD "translations" jsonb NOT NULL`)
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ada354174d7f8a8f3d56c39bba" ON "translations" ("county_code", "language") `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_ada354174d7f8a8f3d56c39bba"`)
    await queryRunner.query(`ALTER TABLE "translations" DROP COLUMN "translations"`)
    await queryRunner.query(`ALTER TABLE "translations" ADD "text" text NOT NULL`)
    await queryRunner.query(`ALTER TABLE "translations" ADD "key" text NOT NULL`)
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4c17bc3d8eefdb8702bb24a2c5" ON "translations" ("county_code", "language", "key") `
    )
  }
}
