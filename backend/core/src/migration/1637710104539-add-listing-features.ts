import { MigrationInterface, QueryRunner } from "typeorm"

export class addListingFeatures1637710104539 implements MigrationInterface {
  name = "addListingFeatures1637710104539"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "listing_features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "elevator" boolean, "wheelchair_ramp" boolean, "service_animals_allowed" boolean, "accessible_parking" boolean, "parking_on_site" boolean, "in_unit_washer_dryer" boolean, "laundry_in_building" boolean, "barrier_free_entrance" boolean, "roll_in_shower" boolean, "grab_bars" boolean, "heating_in_unit" boolean, "ac_in_unit" boolean, CONSTRAINT "PK_88e4fe3e46d21d8b4fdadeb7599" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "listings" ADD "features_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "UQ_ac59a58a02199c57a588f045830" UNIQUE ("features_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_ac59a58a02199c57a588f045830" FOREIGN KEY ("features_id") REFERENCES "listing_features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_ac59a58a02199c57a588f045830"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "UQ_ac59a58a02199c57a588f045830"`
    )
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "features_id"`)
    await queryRunner.query(`DROP TABLE "listing_features"`)
  }
}
