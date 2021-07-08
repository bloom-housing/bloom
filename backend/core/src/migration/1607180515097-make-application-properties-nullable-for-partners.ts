import { MigrationInterface, QueryRunner } from "typeorm"

export class makeApplicationPropertiesNullableForPartners1607180515097
  implements MigrationInterface {
  name = "makeApplicationPropertiesNullableForPartners1607180515097"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "city" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "state" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "street" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "zip_code" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "type" DROP NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "alternate_contact" ALTER COLUMN "first_name" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "alternate_contact" ALTER COLUMN "last_name" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "alternate_contact" ALTER COLUMN "phone_number" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "alternate_contact" ALTER COLUMN "email_address" DROP NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "first_name" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "middle_name" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "last_name" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "birth_month" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "birth_day" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "birth_year" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "phone_number" DROP NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "applicant" ALTER COLUMN "phone_number_type" DROP NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "demographics" ALTER COLUMN "ethnicity" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "demographics" ALTER COLUMN "gender" DROP NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "demographics" ALTER COLUMN "sexual_orientation" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "household_member" ALTER COLUMN "first_name" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "household_member" ALTER COLUMN "middle_name" DROP NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "last_name" DROP NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "household_member" ALTER COLUMN "birth_month" DROP NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "birth_day" DROP NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "household_member" ALTER COLUMN "birth_year" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "household_member" ALTER COLUMN "email_address" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "household_member" ALTER COLUMN "phone_number" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "household_member" ALTER COLUMN "phone_number_type" DROP NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "app_url" DROP NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "applications" ALTER COLUMN "additional_phone" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ALTER COLUMN "additional_phone_number" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ALTER COLUMN "additional_phone_number_type" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ALTER COLUMN "household_size" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ALTER COLUMN "housing_status" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ALTER COLUMN "send_mail_to_mailing_address" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ALTER COLUMN "income_vouchers" DROP NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "income" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "income_period" DROP NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "applications" ALTER COLUMN "accepted_terms" DROP NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "accepted_terms" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "income_period" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "income" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "applications" ALTER COLUMN "income_vouchers" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ALTER COLUMN "send_mail_to_mailing_address" SET NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "housing_status" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "household_size" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "applications" ALTER COLUMN "additional_phone_number_type" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ALTER COLUMN "additional_phone_number" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ALTER COLUMN "additional_phone" SET NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "app_url" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "household_member" ALTER COLUMN "phone_number_type" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "household_member" ALTER COLUMN "phone_number" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "household_member" ALTER COLUMN "email_address" SET NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "birth_year" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "birth_day" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "household_member" ALTER COLUMN "birth_month" SET NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "last_name" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "household_member" ALTER COLUMN "middle_name" SET NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "household_member" ALTER COLUMN "first_name" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "demographics" ALTER COLUMN "sexual_orientation" SET NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "demographics" ALTER COLUMN "gender" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "demographics" ALTER COLUMN "ethnicity" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "phone_number_type" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "phone_number" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "birth_year" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "birth_day" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "birth_month" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "last_name" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "middle_name" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "first_name" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "alternate_contact" ALTER COLUMN "email_address" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "alternate_contact" ALTER COLUMN "phone_number" SET NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "last_name" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "alternate_contact" ALTER COLUMN "first_name" SET NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "type" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "zip_code" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "street" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "state" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "city" SET NOT NULL`)
  }
}
