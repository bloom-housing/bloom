import {MigrationInterface, QueryRunner} from "typeorm";

export class updateNeighborhoodAmenitiesFields1667383571614 implements MigrationInterface {
    name = 'updateNeighborhoodAmenitiesFields1667383571614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listing_neighborhood_amenities" RENAME COLUMN "grocery" TO "grocery_stores"`);
        await queryRunner.query(`ALTER TABLE "listing_neighborhood_amenities" RENAME COLUMN "pharmacy" TO "pharmacies"`);
        await queryRunner.query(`ALTER TABLE "listing_neighborhood_amenities" RENAME COLUMN "medical_clinic" TO "health_care_resources"`);
        await queryRunner.query(`ALTER TABLE "listing_neighborhood_amenities" RENAME COLUMN "park" TO "parks_and_community_centers"`);
        await queryRunner.query(`ALTER TABLE "listing_neighborhood_amenities" RENAME COLUMN "senior_center" TO "schools"`);
        await queryRunner.query(`ALTER TABLE "listing_neighborhood_amenities" ADD COLUMN "public_transportation" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listing_neighborhood_amenities" RENAME COLUMN "grocery_stores" TO "grocery"`);
        await queryRunner.query(`ALTER TABLE "listing_neighborhood_amenities" RENAME COLUMN "pharmacies" TO "pharmacy"`);
        await queryRunner.query(`ALTER TABLE "listing_neighborhood_amenities" RENAME COLUMN "health_care_resources" TO "medical_clinic"`);
        await queryRunner.query(`ALTER TABLE "listing_neighborhood_amenities" RENAME COLUMN "parks_and_community_centers" TO "park"`);
        await queryRunner.query(`ALTER TABLE "listing_neighborhood_amenities" RENAME COLUMN "schools" TO "senior_center"`);
        await queryRunner.query(`ALTER TABLE "listing_neighborhood_amenities" DROP COLUMN "public_transportation"`);
    }
}
