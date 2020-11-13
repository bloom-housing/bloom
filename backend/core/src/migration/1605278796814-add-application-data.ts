import {MigrationInterface, QueryRunner} from "typeorm";

export class addApplicationData1605278796814 implements MigrationInterface {
    name = 'addApplicationData1605278796814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applications" RENAME COLUMN "application" TO "application_id"`);
        await queryRunner.query(`CREATE TABLE "accessibility" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "mobility" boolean, "vision" boolean, "hearing" boolean, CONSTRAINT "PK_9729339e162bc7ec98a8815758c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "place_name" text, "city" character varying NOT NULL, "county" text, "state" character varying NOT NULL, "street" character varying NOT NULL, "street2" text, "zip_code" character varying NOT NULL, "latitude" numeric, "longitude" numeric, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "alternate_contact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "other_type" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "agency" character varying NOT NULL, "phone_number" character varying NOT NULL, "email_address" character varying NOT NULL, CONSTRAINT "PK_4b35560218b2062cccb339975e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "applicant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "middle_name" character varying NOT NULL, "last_name" character varying NOT NULL, "birth_month" integer NOT NULL, "birth_day" integer NOT NULL, "birth_year" integer NOT NULL, "email_address" character varying NOT NULL, "no_email" boolean NOT NULL, "phone_number" character varying NOT NULL, "phone_number_type" character varying NOT NULL, "no_phone" boolean NOT NULL, "work_in_region" boolean NOT NULL, "work_address_id" uuid, "address_id" uuid, CONSTRAINT "REL_7d357035705ebbbe91b5034678" UNIQUE ("work_address_id"), CONSTRAINT "REL_8ba2b09030c3a2b857dda5f83f" UNIQUE ("address_id"), CONSTRAINT "PK_f4a6e907b8b17f293eb073fc5ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "demographics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "ethnicity" character varying NOT NULL, "gender" character varying NOT NULL, "sexual_orientation" character varying NOT NULL, "how_did_you_hear" character varying NOT NULL, "race" character varying NOT NULL, CONSTRAINT "PK_17bf4db5727bd0ad0462c67eda9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "household_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order_id" integer, "first_name" character varying NOT NULL, "middle_name" character varying NOT NULL, "last_name" character varying NOT NULL, "birth_month" integer NOT NULL, "birth_day" integer NOT NULL, "birth_year" integer NOT NULL, "email_address" character varying NOT NULL, "no_email" boolean NOT NULL, "phone_number" character varying NOT NULL, "phone_number_type" character varying NOT NULL, "no_phone" boolean NOT NULL, "same_address" boolean, "relationship" text, "work_in_region" boolean, "address_id" uuid, "work_address_id" uuid, "application_data_id" uuid, CONSTRAINT "REL_7b61da64f1b7a6bbb48eb5bbb4" UNIQUE ("address_id"), CONSTRAINT "REL_f390552cbb929761927c70b7a0" UNIQUE ("work_address_id"), CONSTRAINT "PK_84e1d1f2553646d38e7c8b72a10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "application_data" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "additional_phone" boolean NOT NULL, "additional_phone_number" character varying NOT NULL, "additional_phone_number_type" character varying NOT NULL, "contact_preferences" text array NOT NULL, "household_size" integer NOT NULL, "housing_status" character varying NOT NULL, "send_mail_to_mailing_address" boolean NOT NULL, "income_vouchers" character varying NOT NULL, "income" character varying NOT NULL, "income_period" character varying NOT NULL, "preferred_unit" text array NOT NULL, "preferences" jsonb NOT NULL, "applicant_id" uuid, "mailing_address_id" uuid, "alternate_address_id" uuid, "alternate_contact_id" uuid, "accessibility_id" uuid, "demographics_id" uuid, CONSTRAINT "REL_89391ab290d569238ca58f5e6f" UNIQUE ("applicant_id"), CONSTRAINT "REL_bbd363e426109e64e6d074598d" UNIQUE ("mailing_address_id"), CONSTRAINT "REL_655bcbac8c94ca7d65ffda6a65" UNIQUE ("alternate_address_id"), CONSTRAINT "REL_830e8618acea7c8aaaeaf8dc0c" UNIQUE ("alternate_contact_id"), CONSTRAINT "REL_ce59f4d4cd18dae5e0ec99e09b" UNIQUE ("accessibility_id"), CONSTRAINT "REL_ed6ebfc7777618647c16e65c6c" UNIQUE ("demographics_id"), CONSTRAINT "PK_237c9c4f63ebf9fd0522d3f11b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "blank_paper_application_can_be_picked_up"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "application_id"`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "application_id" uuid`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "UQ_418038704e50c663590feb7f511" UNIQUE ("application_id")`);
        await queryRunner.query(`ALTER TABLE "applicant" ADD CONSTRAINT "FK_7d357035705ebbbe91b50346781" FOREIGN KEY ("work_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applicant" ADD CONSTRAINT "FK_8ba2b09030c3a2b857dda5f83fe" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "household_member" ADD CONSTRAINT "FK_7b61da64f1b7a6bbb48eb5bbb43" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "household_member" ADD CONSTRAINT "FK_f390552cbb929761927c70b7a0d" FOREIGN KEY ("work_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "household_member" ADD CONSTRAINT "FK_40c0c64e707c81c0583e9e6e2ed" FOREIGN KEY ("application_data_id") REFERENCES "application_data"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application_data" ADD CONSTRAINT "FK_89391ab290d569238ca58f5e6f9" FOREIGN KEY ("applicant_id") REFERENCES "applicant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application_data" ADD CONSTRAINT "FK_bbd363e426109e64e6d074598d1" FOREIGN KEY ("mailing_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application_data" ADD CONSTRAINT "FK_655bcbac8c94ca7d65ffda6a650" FOREIGN KEY ("alternate_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application_data" ADD CONSTRAINT "FK_830e8618acea7c8aaaeaf8dc0cc" FOREIGN KEY ("alternate_contact_id") REFERENCES "alternate_contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application_data" ADD CONSTRAINT "FK_ce59f4d4cd18dae5e0ec99e09b7" FOREIGN KEY ("accessibility_id") REFERENCES "accessibility"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application_data" ADD CONSTRAINT "FK_ed6ebfc7777618647c16e65c6c6" FOREIGN KEY ("demographics_id") REFERENCES "demographics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_418038704e50c663590feb7f511" FOREIGN KEY ("application_id") REFERENCES "application_data"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_418038704e50c663590feb7f511"`);
        await queryRunner.query(`ALTER TABLE "application_data" DROP CONSTRAINT "FK_ed6ebfc7777618647c16e65c6c6"`);
        await queryRunner.query(`ALTER TABLE "application_data" DROP CONSTRAINT "FK_ce59f4d4cd18dae5e0ec99e09b7"`);
        await queryRunner.query(`ALTER TABLE "application_data" DROP CONSTRAINT "FK_830e8618acea7c8aaaeaf8dc0cc"`);
        await queryRunner.query(`ALTER TABLE "application_data" DROP CONSTRAINT "FK_655bcbac8c94ca7d65ffda6a650"`);
        await queryRunner.query(`ALTER TABLE "application_data" DROP CONSTRAINT "FK_bbd363e426109e64e6d074598d1"`);
        await queryRunner.query(`ALTER TABLE "application_data" DROP CONSTRAINT "FK_89391ab290d569238ca58f5e6f9"`);
        await queryRunner.query(`ALTER TABLE "household_member" DROP CONSTRAINT "FK_40c0c64e707c81c0583e9e6e2ed"`);
        await queryRunner.query(`ALTER TABLE "household_member" DROP CONSTRAINT "FK_f390552cbb929761927c70b7a0d"`);
        await queryRunner.query(`ALTER TABLE "household_member" DROP CONSTRAINT "FK_7b61da64f1b7a6bbb48eb5bbb43"`);
        await queryRunner.query(`ALTER TABLE "applicant" DROP CONSTRAINT "FK_8ba2b09030c3a2b857dda5f83fe"`);
        await queryRunner.query(`ALTER TABLE "applicant" DROP CONSTRAINT "FK_7d357035705ebbbe91b50346781"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "UQ_418038704e50c663590feb7f511"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "application_id"`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "application_id" jsonb`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "blank_paper_application_can_be_picked_up" boolean`);
        await queryRunner.query(`DROP TABLE "application_data"`);
        await queryRunner.query(`DROP TABLE "household_member"`);
        await queryRunner.query(`DROP TABLE "demographics"`);
        await queryRunner.query(`DROP TABLE "applicant"`);
        await queryRunner.query(`DROP TABLE "alternate_contact"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "accessibility"`);
        await queryRunner.query(`ALTER TABLE "applications" RENAME COLUMN "application_id" TO "application"`);
    }

}
