import { MigrationInterface, QueryRunner } from "typeorm"

export class partnerRole1628543278484 implements MigrationInterface {
  name = "partnerRole1628543278484"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("is_admin" boolean NOT NULL DEFAULT false, "is_partner" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, CONSTRAINT "REL_87b8888186ca9769c960e92687" UNIQUE ("user_id"), CONSTRAINT "PK_87b8888186ca9769c960e926870" PRIMARY KEY ("user_id"))`
    )
    // Add all partners to the table.
    await queryRunner.query(
      `INSERT INTO "user_roles" ("user_id") SELECT DISTINCT "user_accounts_id" FROM "listings_leasing_agents_user_accounts"`
    )
    // Add any admins to the table.
    await queryRunner.query(
      `INSERT INTO "user_roles" ("user_id", "is_admin") SELECT "id", "is_admin" FROM "user_accounts" WHERE "user_accounts"."is_admin" = TRUE`
    )
    // Give everyone partner permissions.
    await queryRunner.query(`UPDATE "user_roles" SET "is_partner" = TRUE`)
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "is_admin"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD "is_admin" boolean NOT NULL DEFAULT false`
    )
    await queryRunner.query(
      `UPDATE "user_accounts" SET "is_admin" = "user_roles"."is_admin" FROM "user_roles" WHERE "user_roles"."user_id" = "user_accounts"."id"`
    )
    await queryRunner.query(`DROP TABLE "user_roles"`)
  }
}
