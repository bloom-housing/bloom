import { MigrationInterface, QueryRunner } from "typeorm"

export class addTranslationsTable1618916649051 implements MigrationInterface {
  name = "addTranslationsTable1618916649051"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "translations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "county_code" character varying NOT NULL, "language" character varying NOT NULL, "key" text NOT NULL, "text" text NOT NULL, CONSTRAINT "PK_7aef875e43ab80d34a0cdd39c70" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4c17bc3d8eefdb8702bb24a2c5" ON "translations" ("county_code", "language", "key") `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_4c17bc3d8eefdb8702bb24a2c5"`)
    await queryRunner.query(`DROP TABLE "translations"`)
  }
}
