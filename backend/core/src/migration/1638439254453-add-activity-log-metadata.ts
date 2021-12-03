import { MigrationInterface, QueryRunner } from "typeorm"

export class addActivityLogMetadata1638439254453 implements MigrationInterface {
  name = "addActivityLogMetadata1638439254453"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "activity_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "module" character varying NOT NULL, "record_id" uuid NOT NULL, "action" character varying NOT NULL, "metadata" jsonb, "user_id" uuid, CONSTRAINT "PK_f25287b6140c5ba18d38776a796" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "activity_logs" ADD CONSTRAINT "FK_d54f841fa5478e4734590d44036" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "activity_logs" DROP CONSTRAINT "FK_d54f841fa5478e4734590d44036"`
    )
    await queryRunner.query(`DROP TABLE "activity_logs"`)
  }
}
