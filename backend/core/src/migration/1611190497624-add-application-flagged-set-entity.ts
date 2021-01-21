import {MigrationInterface, QueryRunner} from "typeorm";

export class addApplicationFlaggedSetEntity1611190497624 implements MigrationInterface {
    name = 'addApplicationFlaggedSetEntity1611190497624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "application-flagged-set" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "flagged_set" text NOT NULL, "rule_name" text NOT NULL, CONSTRAINT "PK_e900ff4f16337d9b97e9c2b5e8f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "application-flagged-set_application_applications" ("application-flagged-set_id" uuid NOT NULL, "applications_id" uuid NOT NULL, CONSTRAINT "PK_8092b4b01942254a07b3355a432" PRIMARY KEY ("application-flagged-set_id", "applications_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4cd12c2dc22cc83328251cf576" ON "application-flagged-set_application_applications" ("application-flagged-set_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7a506b2401d83bb3b894165cc0" ON "application-flagged-set_application_applications" ("applications_id") `);
        await queryRunner.query(`ALTER TABLE "application-flagged-set_application_applications" ADD CONSTRAINT "FK_4cd12c2dc22cc83328251cf5765" FOREIGN KEY ("application-flagged-set_id") REFERENCES "application-flagged-set"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application-flagged-set_application_applications" ADD CONSTRAINT "FK_7a506b2401d83bb3b894165cc04" FOREIGN KEY ("applications_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "application-flagged-set_application_applications" DROP CONSTRAINT "FK_7a506b2401d83bb3b894165cc04"`);
        await queryRunner.query(`ALTER TABLE "application-flagged-set_application_applications" DROP CONSTRAINT "FK_4cd12c2dc22cc83328251cf5765"`);
        await queryRunner.query(`DROP INDEX "IDX_7a506b2401d83bb3b894165cc0"`);
        await queryRunner.query(`DROP INDEX "IDX_4cd12c2dc22cc83328251cf576"`);
        await queryRunner.query(`DROP TABLE "application-flagged-set_application_applications"`);
        await queryRunner.query(`DROP TABLE "application-flagged-set"`);
    }

}
