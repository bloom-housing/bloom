import { MigrationInterface, QueryRunner } from "typeorm"

export class favoritesUserPreferenceNew1639417775347 implements MigrationInterface {
  name = "favoritesUserPreferenceNew1639417775347"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_preferences_favorites_listings" ("user_preferences_user_id" uuid NOT NULL, "listings_id" uuid NOT NULL, CONSTRAINT "PK_a2e38b75e1a538e046de2fba364" PRIMARY KEY ("user_preferences_user_id", "listings_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_0115bda0994ab10a4c1a883504" ON "user_preferences_favorites_listings" ("user_preferences_user_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_c971c586f08b7fe93fcaf29ec0" ON "user_preferences_favorites_listings" ("listings_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "user_preferences_favorites_listings" ADD CONSTRAINT "FK_0115bda0994ab10a4c1a883504e" FOREIGN KEY ("user_preferences_user_id") REFERENCES "user_preferences"("user_id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_preferences_favorites_listings" ADD CONSTRAINT "FK_c971c586f08b7fe93fcaf29ec05" FOREIGN KEY ("listings_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_preferences_favorites_listings" DROP CONSTRAINT "FK_c971c586f08b7fe93fcaf29ec05"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_preferences_favorites_listings" DROP CONSTRAINT "FK_0115bda0994ab10a4c1a883504e"`
    )
    await queryRunner.query(`DROP INDEX "IDX_c971c586f08b7fe93fcaf29ec0"`)
    await queryRunner.query(`DROP INDEX "IDX_0115bda0994ab10a4c1a883504"`)
    await queryRunner.query(`DROP TABLE "user_preferences_favorites_listings"`)
  }
}
