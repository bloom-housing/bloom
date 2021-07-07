import {MigrationInterface, QueryRunner} from "typeorm";

export class applicationDropOffAndMailingAddresses1624985582782 implements MigrationInterface {
    name = 'applicationDropOffAndMailingAddresses1624985582782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" ADD "application_mailing_address" jsonb`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "application_drop_off_address_office_hours" text`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "application_drop_off_address" jsonb`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_mailing_address"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_drop_off_address_office_hours" text`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_drop_off_address" jsonb`);
    }

}
