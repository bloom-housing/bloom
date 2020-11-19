import {MigrationInterface, QueryRunner} from "typeorm";

export class addApplicationFormConfig1605784271938 implements MigrationInterface {
    name = 'addApplicationFormConfig1605784271938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" ADD "application_form_config" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_form_config"`);
    }

}
