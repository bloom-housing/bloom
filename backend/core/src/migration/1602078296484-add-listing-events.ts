import {MigrationInterface, QueryRunner} from "typeorm";

export class addListingEvents1602078296484 implements MigrationInterface {
    name = 'addListingEvents1602078296484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" ADD "events" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "events"`);
    }

}
