import {MigrationInterface, QueryRunner} from "typeorm";

export class removePrimaryApplicantFromAfs1612178072247 implements MigrationInterface {
    name = 'removePrimaryApplicantFromAfs1612178072247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "application_flagged_sets" DROP CONSTRAINT "FK_db66d7d9b272a8c725b928abc32"`);
        await queryRunner.query(`ALTER TABLE "application_flagged_sets" DROP COLUMN "primary_applicant_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "application_flagged_sets" ADD "primary_applicant_id" uuid`);
        await queryRunner.query(`ALTER TABLE "application_flagged_sets" ADD CONSTRAINT "FK_db66d7d9b272a8c725b928abc32" FOREIGN KEY ("primary_applicant_id") REFERENCES "applicant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
