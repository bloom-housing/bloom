import {MigrationInterface, QueryRunner} from "typeorm";

export class addListingEventRelationToAssets1626352944366 implements MigrationInterface {
    name = 'addListingEventRelationToAssets1626352944366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listing_events" ADD "file_id" uuid`);
        await queryRunner.query(`ALTER TABLE "listing_events" ADD CONSTRAINT "FK_4fd176b179ce281bedb1b7b9f2b" FOREIGN KEY ("file_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listing_events" DROP CONSTRAINT "FK_4fd176b179ce281bedb1b7b9f2b"`);
        await queryRunner.query(`ALTER TABLE "listing_events" DROP COLUMN "file_id"`);
    }

}
