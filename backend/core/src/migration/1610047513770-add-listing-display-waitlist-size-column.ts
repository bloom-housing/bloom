import {MigrationInterface, QueryRunner} from "typeorm";

export class addListingDisplayWaitlistSizeColumn1610047513770 implements MigrationInterface {
    name = 'addListingDisplayWaitlistSizeColumn1610047513770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" ADD "display_waitlist_size" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "display_waitlist_size"`);
    }

}
