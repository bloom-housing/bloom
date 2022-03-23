import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserAgreedToTermsOfServiceColumn1648043352040 implements MigrationInterface {
    name = 'addUserAgreedToTermsOfServiceColumn1648043352040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_accounts" ADD "agreed_to_terms_of_service" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "agreed_to_terms_of_service"`);
    }

}
