import {MigrationInterface, QueryRunner} from "typeorm";
import { IsBoolean } from "class-validator"
import { ValidationsGroupsEnum } from "../shared/validations-groups.enum"

export class addSoftDeleteToAbstractEntity1610100146255 implements MigrationInterface {
    name = 'addSoftDeleteToAbstractEntity1610100146255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applicant" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "alternate_contact" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "accessibility" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "demographics" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "household_member" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "application_preferences" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "address" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "application_preferences" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "household_member" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "demographics" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "accessibility" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "alternate_contact" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "applicant" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "deleted_at"`);
    }

}
