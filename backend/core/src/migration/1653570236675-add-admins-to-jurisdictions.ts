import { MigrationInterface, QueryRunner } from "typeorm"

export class addAdminsToJurisdictions1653570236675 implements MigrationInterface {
  name = "addAdminsToJurisdictions1653570236675"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "jurisdictions_admins_user_accounts" ("jurisdictions_id" uuid NOT NULL, "user_accounts_id" uuid NOT NULL, CONSTRAINT "PK_4f7c56b113ab80b24489a67ed6d" PRIMARY KEY ("jurisdictions_id", "user_accounts_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_6c3e14ba6e91c60e34d711c6a7" ON "jurisdictions_admins_user_accounts" ("jurisdictions_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_4fda1ae0bf4fbdbe0d0bc61763" ON "jurisdictions_admins_user_accounts" ("user_accounts_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_admins_user_accounts" ADD CONSTRAINT "FK_6c3e14ba6e91c60e34d711c6a7b" FOREIGN KEY ("jurisdictions_id") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_admins_user_accounts" ADD CONSTRAINT "FK_4fda1ae0bf4fbdbe0d0bc61763c" FOREIGN KEY ("user_accounts_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_admins_user_accounts" DROP CONSTRAINT "FK_4fda1ae0bf4fbdbe0d0bc61763c"`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_admins_user_accounts" DROP CONSTRAINT "FK_6c3e14ba6e91c60e34d711c6a7b"`
    )
    await queryRunner.query(`DROP INDEX "IDX_4fda1ae0bf4fbdbe0d0bc61763"`)
    await queryRunner.query(`DROP INDEX "IDX_6c3e14ba6e91c60e34d711c6a7"`)
    await queryRunner.query(`DROP TABLE "jurisdictions_admins_user_accounts"`)
  }
}
