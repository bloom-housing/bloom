import {MigrationInterface, QueryRunner} from "typeorm";

export class addManyToManyForResolvedApplications1615427369266 implements MigrationInterface {
    name = 'addManyToManyForResolvedApplications1615427369266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "application_flagged_sets_resolved_applications_applications" ("application_flagged_sets_id" uuid NOT NULL, "applications_id" uuid NOT NULL, CONSTRAINT "PK_c01b3194002b7f1e1869cf27d52" PRIMARY KEY ("application_flagged_sets_id", "applications_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a7db0f1d5c972b8e6b35099159" ON "application_flagged_sets_resolved_applications_applications" ("application_flagged_sets_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b0dcdc9cb25c059312ad5ffce5" ON "application_flagged_sets_resolved_applications_applications" ("applications_id") `);
        await queryRunner.query(`ALTER TABLE "application_flagged_sets_resolved_applications_applications" ADD CONSTRAINT "FK_a7db0f1d5c972b8e6b350991591" FOREIGN KEY ("application_flagged_sets_id") REFERENCES "application_flagged_sets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application_flagged_sets_resolved_applications_applications" ADD CONSTRAINT "FK_b0dcdc9cb25c059312ad5ffce59" FOREIGN KEY ("applications_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "application_flagged_sets_resolved_applications_applications" DROP CONSTRAINT "FK_b0dcdc9cb25c059312ad5ffce59"`);
        await queryRunner.query(`ALTER TABLE "application_flagged_sets_resolved_applications_applications" DROP CONSTRAINT "FK_a7db0f1d5c972b8e6b350991591"`);
        await queryRunner.query(`DROP INDEX "IDX_b0dcdc9cb25c059312ad5ffce5"`);
        await queryRunner.query(`DROP INDEX "IDX_a7db0f1d5c972b8e6b35099159"`);
        await queryRunner.query(`DROP TABLE "application_flagged_sets_resolved_applications_applications"`);
    }

}
