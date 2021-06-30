import {MigrationInterface, QueryRunner} from "typeorm";

export class addResultLinkAndWaitlistFieldsToListing1624873640959 implements MigrationInterface {
    name = 'addResultLinkAndWaitlistFieldsToListing1624873640959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" ADD "result_link" text`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "is_waitlist_open" boolean`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "waitlist_open_spots" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "listings"."display_waitlist_size" IS NULL`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "display_waitlist_size" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "display_waitlist_size" SET DEFAULT false`);
        await queryRunner.query(`COMMENT ON COLUMN "listings"."display_waitlist_size" IS NULL`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "waitlist_open_spots"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "is_waitlist_open"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "result_link"`);
    }

}
