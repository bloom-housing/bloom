import { MigrationInterface, QueryRunner } from "typeorm"

export class addListingPreferencesIntermediateRelation1633113273492 implements MigrationInterface {
  name = "addListingPreferencesIntermediateRelation1633113273492"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "listing_preferences" ("listing_id" character varying NOT NULL, "preference_id" character varying NOT NULL, "ordinal" integer, "listingId" uuid, "preferenceId" uuid, CONSTRAINT "PK_3a99e1cc861df8e2b81ab885839" PRIMARY KEY ("listing_id", "preference_id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_preferences" ADD CONSTRAINT "FK_e9d2ae607be20b2f7aae0899c42" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_preferences" ADD CONSTRAINT "FK_b47a4b92e2c4ad065c5e4b78b72" FOREIGN KEY ("preferenceId") REFERENCES "preferences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listing_preferences" DROP CONSTRAINT "FK_b47a4b92e2c4ad065c5e4b78b72"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_preferences" DROP CONSTRAINT "FK_e9d2ae607be20b2f7aae0899c42"`
    )
    await queryRunner.query(`DROP TABLE "listing_preferences"`)
  }
}
