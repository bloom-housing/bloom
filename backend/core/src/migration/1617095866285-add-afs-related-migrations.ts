import { MigrationInterface, QueryRunner } from "typeorm"

export class addAfsRelatedMigrations1617095866285 implements MigrationInterface {
  name = "addAfsRelatedMigrations1617095866285"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "application_flagged_set" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "rule" character varying NOT NULL, "resolved" boolean NOT NULL, "resolved_time" TIMESTAMP WITH TIME ZONE, "status" character varying NOT NULL DEFAULT 'flagged', "resolving_user_id_id" uuid, "listing_id" uuid, CONSTRAINT "PK_81969e689800a802b75ffd883cc" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "application_flagged_set_applications_applications" ("application_flagged_set_id" uuid NOT NULL, "applications_id" uuid NOT NULL, CONSTRAINT "PK_ceffc85d4559c5de81c20081c5e" PRIMARY KEY ("application_flagged_set_id", "applications_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_93f583f2d43fb21c5d7ceac57e" ON "application_flagged_set_applications_applications" ("application_flagged_set_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_bbae218ba0eff977157fad5ea3" ON "application_flagged_set_applications_applications" ("applications_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" ADD CONSTRAINT "FK_23c3b0688a74c8c2c59e1016bf0" FOREIGN KEY ("resolving_user_id_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" ADD CONSTRAINT "FK_f2ace84eebd770f1387b47e5e45" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set_applications_applications" ADD CONSTRAINT "FK_93f583f2d43fb21c5d7ceac57e7" FOREIGN KEY ("application_flagged_set_id") REFERENCES "application_flagged_set"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set_applications_applications" ADD CONSTRAINT "FK_bbae218ba0eff977157fad5ea31" FOREIGN KEY ("applications_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set_applications_applications" DROP CONSTRAINT "FK_bbae218ba0eff977157fad5ea31"`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set_applications_applications" DROP CONSTRAINT "FK_93f583f2d43fb21c5d7ceac57e7"`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" DROP CONSTRAINT "FK_f2ace84eebd770f1387b47e5e45"`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" DROP CONSTRAINT "FK_23c3b0688a74c8c2c59e1016bf0"`
    )
    await queryRunner.query(`DROP INDEX "IDX_bbae218ba0eff977157fad5ea3"`)
    await queryRunner.query(`DROP INDEX "IDX_93f583f2d43fb21c5d7ceac57e"`)
    await queryRunner.query(`DROP TABLE "application_flagged_set_applications_applications"`)
    await queryRunner.query(`DROP TABLE "application_flagged_set"`)
  }
}
