import {MigrationInterface, QueryRunner} from "typeorm";

export class partnerUserRoles1628276143069 implements MigrationInterface {
    name = 'partnerUserRoles1628276143069'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_roles" ("is_admin" boolean NOT NULL DEFAULT false, "is_partner" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, CONSTRAINT "REL_87b8888186ca9769c960e92687" UNIQUE ("user_id"), CONSTRAINT "PK_87b8888186ca9769c960e926870" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`INSERT INTO "user_roles" ("user_id") SELECT "id" FROM "user_accounts"`)
        // Initially, all existing users have partner access. This should be revoked over time.
        await queryRunner.query(`UPDATE "user_roles" SET "is_partner" = TRUE`)
        await queryRunner.query(`UPDATE "user_roles" SET "is_admin" = "user_accounts"."is_admin" FROM "user_accounts" WHERE "user_accounts"."id" = "user_roles"."user_id"`)
        await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "is_admin"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_accounts" ADD "is_admin" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`UPDATE "user_accounts" SET "is_admin" = "user_roles"."is_admin" FROM "user_roles" WHERE "user_roles"."user_id" = "user_accounts"."id"`)
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
    }

}
