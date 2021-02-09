import {MigrationInterface, QueryRunner} from "typeorm";

export class addManyToManyAfsApplication1612831363341 implements MigrationInterface {
    name = 'addManyToManyAfsApplication1612831363341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "application_flagged_sets_resolved_application_applications" ("application_flagged_sets_id" uuid NOT NULL, "applications_id" uuid NOT NULL, CONSTRAINT "PK_a5064c267a0b8346abc0d8846d7" PRIMARY KEY ("application_flagged_sets_id", "applications_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6600c53ed7f743b305efd81699" ON "application_flagged_sets_resolved_application_applications" ("application_flagged_sets_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_90c877fee50db044dedfbd2798" ON "application_flagged_sets_resolved_application_applications" ("applications_id") `);
        await queryRunner.query(`ALTER TABLE "application_flagged_sets_resolved_application_applications" ADD CONSTRAINT "FK_6600c53ed7f743b305efd816999" FOREIGN KEY ("application_flagged_sets_id") REFERENCES "application_flagged_sets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application_flagged_sets_resolved_application_applications" ADD CONSTRAINT "FK_90c877fee50db044dedfbd2798a" FOREIGN KEY ("applications_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "application_flagged_sets_resolved_application_applications" DROP CONSTRAINT "FK_90c877fee50db044dedfbd2798a"`);
        await queryRunner.query(`ALTER TABLE "application_flagged_sets_resolved_application_applications" DROP CONSTRAINT "FK_6600c53ed7f743b305efd816999"`);
        await queryRunner.query(`DROP INDEX "IDX_90c877fee50db044dedfbd2798"`);
        await queryRunner.query(`DROP INDEX "IDX_6600c53ed7f743b305efd81699"`);
        await queryRunner.query(`DROP TABLE "application_flagged_sets_resolved_application_applications"`);
    }

}
