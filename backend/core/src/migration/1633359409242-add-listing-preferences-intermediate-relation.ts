import { MigrationInterface, QueryRunner } from "typeorm"

export class addListingPreferencesIntermediateRelation1633359409242 implements MigrationInterface {
  name = "addListingPreferencesIntermediateRelation1633359409242"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "listing_preferences" ("ordinal" integer, "listing_id" uuid NOT NULL, "preference_id" uuid NOT NULL, CONSTRAINT "PK_3a99e1cc861df8e2b81ab885839" PRIMARY KEY ("listing_id", "preference_id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_preferences" ADD CONSTRAINT "FK_b7fad48d744befbd6532d8a04a0" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_preferences" ADD CONSTRAINT "FK_797708bfa7897f574b8eb73cdcb" FOREIGN KEY ("preference_id") REFERENCES "preferences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listing_preferences" DROP CONSTRAINT "FK_797708bfa7897f574b8eb73cdcb"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_preferences" DROP CONSTRAINT "FK_b7fad48d744befbd6532d8a04a0"`
    )
    await queryRunner.query(`DROP TABLE "listing_preferences"`)
  }
}
