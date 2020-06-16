import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUsers1592326547598 implements MigrationInterface {
    name = 'AddUsers1592326547598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password_hash" character varying NOT NULL, "email" character varying NOT NULL, "first_name" character varying NOT NULL, "middle_name" character varying, "last_name" character varying NOT NULL, "dob" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_125e915cf23ad1cfb43815ce59b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX user_accounts_email_lower ON user_accounts (lower(email))`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX user_accounts_email_lower`)
        await queryRunner.query(`DROP TABLE "user_accounts"`);
    }

}
