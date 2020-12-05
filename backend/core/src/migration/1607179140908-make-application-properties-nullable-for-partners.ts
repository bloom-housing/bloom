import {MigrationInterface, QueryRunner} from "typeorm";

export class makeApplicationPropertiesNullableForPartners1607179140908 implements MigrationInterface {
    name = 'makeApplicationPropertiesNullableForPartners1607179140908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "city" TYPE text`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "state" TYPE text`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "street" TYPE text`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "zip_code" TYPE text`);
        await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "type" TYPE text`);
        await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "other_type" TYPE text`);
        await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "first_name" TYPE text`);
        await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "last_name" TYPE text`);
        await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "agency" TYPE text`);
        await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "phone_number" TYPE text`);
        await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "email_address" TYPE text`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "first_name" TYPE text`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "middle_name" TYPE text`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "last_name" TYPE text`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "birth_month" TYPE text`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "birth_day" TYPE text`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "birth_year" TYPE text`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "email_address" TYPE text`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "no_email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "phone_number" TYPE text`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "phone_number_type" TYPE text`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "no_phone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "demographics" ALTER COLUMN "ethnicity" TYPE text`);
        await queryRunner.query(`ALTER TABLE "demographics" ALTER COLUMN "gender" TYPE text`);
        await queryRunner.query(`ALTER TABLE "demographics" ALTER COLUMN "sexual_orientation" TYPE text`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "order_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "first_name" TYPE text`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "middle_name" TYPE text`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "last_name" TYPE text`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "birth_month" TYPE text`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "birth_day" TYPE text`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "birth_year" TYPE text`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "email_address" TYPE text`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "phone_number" TYPE text`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "phone_number_type" TYPE text`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "app_url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "additional_phone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "additional_phone_number" TYPE text`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "additional_phone_number_type" TYPE text`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "household_size" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "housing_status" TYPE text`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "send_mail_to_mailing_address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "income_vouchers" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "income" TYPE text`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "income_period" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "accepted_terms" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "accepted_terms" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "income_period" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "income" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "income_vouchers" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "send_mail_to_mailing_address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "housing_status" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "household_size" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "additional_phone_number_type" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "additional_phone_number" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "additional_phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "app_url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "phone_number_type" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "phone_number" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "email_address" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "birth_year" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "birth_day" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "birth_month" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "last_name" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "middle_name" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "first_name" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "order_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "demographics" ALTER COLUMN "sexual_orientation" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "demographics" ALTER COLUMN "gender" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "demographics" ALTER COLUMN "ethnicity" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "no_phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "phone_number_type" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "phone_number" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "no_email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "email_address" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "birth_year" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "birth_day" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "birth_month" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "last_name" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "middle_name" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "first_name" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "email_address" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "phone_number" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "agency" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "last_name" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "first_name" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "other_type" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "type" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "zip_code" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "street" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "state" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "city" TYPE varchar`);
    }

}
