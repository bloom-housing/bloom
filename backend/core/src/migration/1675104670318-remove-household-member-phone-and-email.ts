import {MigrationInterface, QueryRunner} from "typeorm";

export class removeHouseholdMemberPhoneAndEmail1675104670318 implements MigrationInterface {
    name = 'removeHouseholdMemberPhoneAndEmail1675104670318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "household_member" DROP COLUMN "no_email"`);
        await queryRunner.query(`ALTER TABLE "household_member" DROP COLUMN "no_phone"`);
        await queryRunner.query(`ALTER TABLE "household_member" DROP COLUMN "email_address"`);
        await queryRunner.query(`ALTER TABLE "household_member" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "household_member" DROP COLUMN "phone_number_type"`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "afs_last_run_at" SET DEFAULT '1970-01-01'`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "last_application_update_at" SET DEFAULT '1970-01-01'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "last_application_update_at" SET DEFAULT '1970-01-01 00:00:00+00'`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "afs_last_run_at" SET DEFAULT '1970-01-01 00:00:00+00'`);
        await queryRunner.query(`ALTER TABLE "household_member" ADD "phone_number_type" text`);
        await queryRunner.query(`ALTER TABLE "household_member" ADD "phone_number" text`);
        await queryRunner.query(`ALTER TABLE "household_member" ADD "email_address" text`);
        await queryRunner.query(`ALTER TABLE "household_member" ADD "no_phone" boolean`);
        await queryRunner.query(`ALTER TABLE "household_member" ADD "no_email" boolean`);
    }

}
