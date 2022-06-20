import {MigrationInterface, QueryRunner} from "typeorm";

export class removePropertyRelation1655730916169 implements MigrationInterface {
    name = 'removePropertyRelation1655730916169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_f221e6d7bfd686266003b982b5f"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_9eef913a9013d6e3d09a92ec075"`);
        await queryRunner.query(`ALTER TABLE "units" RENAME COLUMN "property_id" TO "listing_id"`);
        await queryRunner.query(`CREATE TABLE "listing_features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "elevator" boolean, "wheelchair_ramp" boolean, "service_animals_allowed" boolean, "accessible_parking" boolean, "parking_on_site" boolean, "in_unit_washer_dryer" boolean, "laundry_in_building" boolean, "barrier_free_entrance" boolean, "roll_in_shower" boolean, "grab_bars" boolean, "heating_in_unit" boolean, "ac_in_unit" boolean, "hearing" boolean, "visual" boolean, "mobility" boolean, CONSTRAINT "PK_88e4fe3e46d21d8b4fdadeb7599" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "property_id"`);
        await queryRunner.query(`ALTER TABLE "jurisdictions" ADD "enable_partner_settings" boolean`);
        await queryRunner.query(`ALTER TABLE "jurisdictions" ADD "enable_accessibility_features" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "accessibility" text`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "amenities" text`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "building_total_units" integer`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "developer" text`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "household_size_max" integer`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "household_size_min" integer`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "neighborhood" text`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "pet_policy" text`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "smoking_policy" text`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "units_available" integer`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "unit_amenities" text`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "services_offered" text`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "year_built" integer`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "building_address_id" uuid`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "UQ_e5d5291cd6ab92cbec304aab905" UNIQUE ("building_address_id")`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "features_id" uuid`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "UQ_ac59a58a02199c57a588f045830" UNIQUE ("features_id")`);
        await queryRunner.query(`ALTER TABLE "units" ADD CONSTRAINT "FK_9aebcde52d6e054e5ac5d26228c" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_e5d5291cd6ab92cbec304aab905" FOREIGN KEY ("building_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_ac59a58a02199c57a588f045830" FOREIGN KEY ("features_id") REFERENCES "listing_features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_ac59a58a02199c57a588f045830"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_e5d5291cd6ab92cbec304aab905"`);
        await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_9aebcde52d6e054e5ac5d26228c"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "UQ_ac59a58a02199c57a588f045830"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "features_id"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "UQ_e5d5291cd6ab92cbec304aab905"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "building_address_id"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "year_built"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "services_offered"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "unit_amenities"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "units_available"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "smoking_policy"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "pet_policy"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "neighborhood"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "household_size_min"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "household_size_max"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "developer"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "building_total_units"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "amenities"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "accessibility"`);
        await queryRunner.query(`ALTER TABLE "jurisdictions" DROP COLUMN "enable_accessibility_features"`);
        await queryRunner.query(`ALTER TABLE "jurisdictions" DROP COLUMN "enable_partner_settings"`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "property_id" uuid NOT NULL`);
        await queryRunner.query(`DROP TABLE "listing_features"`);
        await queryRunner.query(`ALTER TABLE "units" RENAME COLUMN "listing_id" TO "property_id"`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_9eef913a9013d6e3d09a92ec075" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "units" ADD CONSTRAINT "FK_f221e6d7bfd686266003b982b5f" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
