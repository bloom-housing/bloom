import {MigrationInterface, QueryRunner} from "typeorm";

export class addApplicationFlaggedSetEntity1611766894544 implements MigrationInterface {
    name = 'addApplicationFlaggedSetEntity1611766894544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "application_flagged_sets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "rule" character varying NOT NULL, "resolved" boolean NOT NULL, "resolved_time" TIMESTAMP WITH TIME ZONE, "status" character varying NOT NULL DEFAULT 'flagged', "primary_applicant_id" uuid, "resolving_user_id_id" uuid, CONSTRAINT "PK_f96508584235e96c554995a39f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "application_flagged_sets_applications_applications" ("application_flagged_sets_id" uuid NOT NULL, "applications_id" uuid NOT NULL, CONSTRAINT "PK_5db9a180e54863508ef1bb23bdb" PRIMARY KEY ("application_flagged_sets_id", "applications_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97e16b32817bd05442388e2cad" ON "application_flagged_sets_applications_applications" ("application_flagged_sets_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_bbd630650c986031800e9d978f" ON "application_flagged_sets_applications_applications" ("applications_id") `);
        await queryRunner.query(`ALTER TABLE "application_flagged_sets" ADD CONSTRAINT "FK_db66d7d9b272a8c725b928abc32" FOREIGN KEY ("primary_applicant_id") REFERENCES "applicant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application_flagged_sets" ADD CONSTRAINT "FK_f1aae628d664c3960ce9c481e1e" FOREIGN KEY ("resolving_user_id_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application_flagged_sets_applications_applications" ADD CONSTRAINT "FK_97e16b32817bd05442388e2cada" FOREIGN KEY ("application_flagged_sets_id") REFERENCES "application_flagged_sets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application_flagged_sets_applications_applications" ADD CONSTRAINT "FK_bbd630650c986031800e9d978fd" FOREIGN KEY ("applications_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "application_flagged_sets_applications_applications" DROP CONSTRAINT "FK_bbd630650c986031800e9d978fd"`);
        await queryRunner.query(`ALTER TABLE "application_flagged_sets_applications_applications" DROP CONSTRAINT "FK_97e16b32817bd05442388e2cada"`);
        await queryRunner.query(`ALTER TABLE "application_flagged_sets" DROP CONSTRAINT "FK_f1aae628d664c3960ce9c481e1e"`);
        await queryRunner.query(`ALTER TABLE "application_flagged_sets" DROP CONSTRAINT "FK_db66d7d9b272a8c725b928abc32"`);
        await queryRunner.query(`DROP INDEX "IDX_bbd630650c986031800e9d978f"`);
        await queryRunner.query(`DROP INDEX "IDX_97e16b32817bd05442388e2cad"`);
        await queryRunner.query(`DROP TABLE "application_flagged_sets_applications_applications"`);
        await queryRunner.query(`DROP TABLE "application_flagged_sets"`);
    }

}
