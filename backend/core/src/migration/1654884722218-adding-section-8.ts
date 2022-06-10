import {MigrationInterface, QueryRunner} from "typeorm";

export class addingSection81654884722218 implements MigrationInterface {
    name = 'addingSection81654884722218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" ADD "section8_acceptance" boolean`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "marketing_season"`);
        await queryRunner.query(`DROP TYPE "public"."listings_marketing_season_enum"`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "marketing_season" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "marketing_season"`);
        await queryRunner.query(`CREATE TYPE "public"."listings_marketing_season_enum" AS ENUM('spring', 'summer', 'fall', 'winter')`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "marketing_season" "listings_marketing_season_enum"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "section8_acceptance"`);
    }

}
