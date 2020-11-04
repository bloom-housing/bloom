import {MigrationInterface, QueryRunner} from "typeorm";

export class addApplicationProps1604488594686 implements MigrationInterface {
    name = 'addApplicationProps1604488594686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "applications_status_enum" AS ENUM('draft', 'submitted', 'removed')`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "status" "applications_status_enum" NOT NULL DEFAULT 'submitted'`);
        await queryRunner.query(`CREATE TYPE "applications_language_enum" AS ENUM('en', 'es')`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "language" "applications_language_enum" NOT NULL DEFAULT 'en'`);
        await queryRunner.query(`CREATE TYPE "applications_submission_type_enum" AS ENUM('paper', 'electronical')`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "submission_type" "applications_submission_type_enum" NOT NULL DEFAULT 'electronical'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "submission_type"`);
        await queryRunner.query(`DROP TYPE "applications_submission_type_enum"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "language"`);
        await queryRunner.query(`DROP TYPE "applications_language_enum"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "applications_status_enum"`);
    }

}
