import { MigrationInterface, QueryRunner } from "typeorm"

export class addApplicationData1605691160237 implements MigrationInterface {
  name = "addApplicationData1605691160237"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "accessibility" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "mobility" boolean, "vision" boolean, "hearing" boolean, CONSTRAINT "PK_9729339e162bc7ec98a8815758c" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "place_name" text, "city" character varying NOT NULL, "county" text, "state" character varying NOT NULL, "street" character varying NOT NULL, "street2" text, "zip_code" character varying NOT NULL, "latitude" numeric, "longitude" numeric, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "alternate_contact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "other_type" character varying, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "agency" character varying, "phone_number" character varying NOT NULL, "email_address" character varying NOT NULL, CONSTRAINT "PK_4b35560218b2062cccb339975e7" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "applicant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "middle_name" character varying NOT NULL, "last_name" character varying NOT NULL, "birth_month" character varying NOT NULL, "birth_day" character varying NOT NULL, "birth_year" character varying NOT NULL, "email_address" character varying NOT NULL, "no_email" boolean NOT NULL, "phone_number" character varying NOT NULL, "phone_number_type" character varying NOT NULL, "no_phone" boolean NOT NULL, "work_in_region" text, "work_address_id" uuid, "address_id" uuid, CONSTRAINT "REL_7d357035705ebbbe91b5034678" UNIQUE ("work_address_id"), CONSTRAINT "REL_8ba2b09030c3a2b857dda5f83f" UNIQUE ("address_id"), CONSTRAINT "PK_f4a6e907b8b17f293eb073fc5ea" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "application_preferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "live_in" boolean NOT NULL, "none" boolean NOT NULL, "work_in" boolean NOT NULL, CONSTRAINT "PK_97729a397c6bff3aaa3bde8be94" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "demographics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "ethnicity" character varying NOT NULL, "gender" character varying NOT NULL, "sexual_orientation" character varying NOT NULL, "how_did_you_hear" text array NOT NULL, "race" character varying NOT NULL, CONSTRAINT "PK_17bf4db5727bd0ad0462c67eda9" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "household_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order_id" integer NOT NULL, "first_name" character varying NOT NULL, "middle_name" character varying NOT NULL, "last_name" character varying NOT NULL, "birth_month" character varying NOT NULL, "birth_day" character varying NOT NULL, "birth_year" character varying NOT NULL, "email_address" character varying NOT NULL, "no_email" boolean, "phone_number" character varying NOT NULL, "phone_number_type" character varying NOT NULL, "no_phone" boolean, "same_address" boolean, "relationship" text, "work_in_region" boolean, "address_id" uuid, "work_address_id" uuid, "application_id" uuid, CONSTRAINT "REL_7b61da64f1b7a6bbb48eb5bbb4" UNIQUE ("address_id"), CONSTRAINT "REL_f390552cbb929761927c70b7a0" UNIQUE ("work_address_id"), CONSTRAINT "PK_84e1d1f2553646d38e7c8b72a10" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "application"`)
    await queryRunner.query(`ALTER TABLE "applications" ADD "additional_phone" boolean NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "applications" ADD "additional_phone_number" character varying NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD "additional_phone_number_type" character varying NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD "contact_preferences" text array NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "applications" ADD "household_size" integer NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "applications" ADD "housing_status" character varying NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD "send_mail_to_mailing_address" boolean NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "applications" ADD "income_vouchers" boolean NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applications" ADD "income" character varying NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "applications" ADD "income_period" character varying NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "applications" ADD "preferred_unit" text array NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applications" ADD "language" character varying NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "applications" ADD "submission_type" character varying NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "applications" ADD "accepted_terms" boolean NOT NULL`)
    await queryRunner.query(`ALTER TABLE "applications" ADD "applicant_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "UQ_194d0fca275b8661a56e486cb64" UNIQUE ("applicant_id")`
    )
    await queryRunner.query(`ALTER TABLE "applications" ADD "mailing_address_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "UQ_b72ba26ebc88981f441b30fe3c5" UNIQUE ("mailing_address_id")`
    )
    await queryRunner.query(`ALTER TABLE "applications" ADD "alternate_address_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "UQ_7fc41f89f22ca59ffceab5da80e" UNIQUE ("alternate_address_id")`
    )
    await queryRunner.query(`ALTER TABLE "applications" ADD "alternate_contact_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "UQ_56abaa378952856aaccc64d7eb3" UNIQUE ("alternate_contact_id")`
    )
    await queryRunner.query(`ALTER TABLE "applications" ADD "accessibility_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "UQ_3a4c71bc34dce9f6c196f110935" UNIQUE ("accessibility_id")`
    )
    await queryRunner.query(`ALTER TABLE "applications" ADD "demographics_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "UQ_fed5da45b7b4dafd9f025a37dd1" UNIQUE ("demographics_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "applicant" ADD CONSTRAINT "FK_7d357035705ebbbe91b50346781" FOREIGN KEY ("work_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "applicant" ADD CONSTRAINT "FK_8ba2b09030c3a2b857dda5f83fe" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "household_member" ADD CONSTRAINT "FK_7b61da64f1b7a6bbb48eb5bbb43" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "household_member" ADD CONSTRAINT "FK_f390552cbb929761927c70b7a0d" FOREIGN KEY ("work_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "household_member" ADD CONSTRAINT "FK_520996eeecf9f6fb9425dc7352c" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_194d0fca275b8661a56e486cb64" FOREIGN KEY ("applicant_id") REFERENCES "applicant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_b72ba26ebc88981f441b30fe3c5" FOREIGN KEY ("mailing_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_7fc41f89f22ca59ffceab5da80e" FOREIGN KEY ("alternate_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_56abaa378952856aaccc64d7eb3" FOREIGN KEY ("alternate_contact_id") REFERENCES "alternate_contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_3a4c71bc34dce9f6c196f110935" FOREIGN KEY ("accessibility_id") REFERENCES "accessibility"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_fed5da45b7b4dafd9f025a37dd1" FOREIGN KEY ("demographics_id") REFERENCES "demographics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_fed5da45b7b4dafd9f025a37dd1"`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_3a4c71bc34dce9f6c196f110935"`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_56abaa378952856aaccc64d7eb3"`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_7fc41f89f22ca59ffceab5da80e"`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_b72ba26ebc88981f441b30fe3c5"`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_194d0fca275b8661a56e486cb64"`
    )
    await queryRunner.query(
      `ALTER TABLE "household_member" DROP CONSTRAINT "FK_520996eeecf9f6fb9425dc7352c"`
    )
    await queryRunner.query(
      `ALTER TABLE "household_member" DROP CONSTRAINT "FK_f390552cbb929761927c70b7a0d"`
    )
    await queryRunner.query(
      `ALTER TABLE "household_member" DROP CONSTRAINT "FK_7b61da64f1b7a6bbb48eb5bbb43"`
    )
    await queryRunner.query(
      `ALTER TABLE "applicant" DROP CONSTRAINT "FK_8ba2b09030c3a2b857dda5f83fe"`
    )
    await queryRunner.query(
      `ALTER TABLE "applicant" DROP CONSTRAINT "FK_7d357035705ebbbe91b50346781"`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "UQ_fed5da45b7b4dafd9f025a37dd1"`
    )
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "demographics_id"`)
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "UQ_3a4c71bc34dce9f6c196f110935"`
    )
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "accessibility_id"`)
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "UQ_56abaa378952856aaccc64d7eb3"`
    )
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "alternate_contact_id"`)
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "UQ_7fc41f89f22ca59ffceab5da80e"`
    )
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "alternate_address_id"`)
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "UQ_b72ba26ebc88981f441b30fe3c5"`
    )
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "mailing_address_id"`)
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "UQ_194d0fca275b8661a56e486cb64"`
    )
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "applicant_id"`)
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "accepted_terms"`)
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "submission_type"`)
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "language"`)
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "preferred_unit"`)
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "income_period"`)
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "income"`)
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "income_vouchers"`)
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "send_mail_to_mailing_address"`)
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "housing_status"`)
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "household_size"`)
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "contact_preferences"`)
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "additional_phone_number_type"`)
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "additional_phone_number"`)
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "additional_phone"`)
    await queryRunner.query(`ALTER TABLE "applications" ADD "application" jsonb`)
    await queryRunner.query(`DROP TABLE "household_member"`)
    await queryRunner.query(`DROP TABLE "demographics"`)
    await queryRunner.query(`DROP TABLE "application_preferences"`)
    await queryRunner.query(`DROP TABLE "applicant"`)
    await queryRunner.query(`DROP TABLE "alternate_contact"`)
    await queryRunner.query(`DROP TABLE "address"`)
    await queryRunner.query(`DROP TABLE "accessibility"`)
  }
}
