import {MigrationInterface, QueryRunner} from "typeorm";

export class addDatesToListing1643191027392 implements MigrationInterface {
    name = 'addDatesToListing1643191027392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" ADD "published_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "closed_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "closed_at"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "published_at"`);
    }

}
