import { MigrationInterface, QueryRunner } from "typeorm"

export class addGeneratedListingTranslation1637680690577 implements MigrationInterface {
  name = "addGeneratedListingTranslation1637680690577"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "generated_listing_translations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "listing_id" character varying NOT NULL, "jurisdiction_id" character varying NOT NULL, "language" character varying NOT NULL, "translations" jsonb NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_4059452831439aefc27c1990b20" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "generated_listing_translations"`)
  }
}
