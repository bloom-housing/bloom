import { MigrationInterface, QueryRunner } from "typeorm"

export class addCronJobTable1669824182732 implements MigrationInterface {
  name = "addCronJobTable1669824182732"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cron_job" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text, "last_run_date" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3f180d097e1216411578b642513" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cron_job"`)
  }
}
