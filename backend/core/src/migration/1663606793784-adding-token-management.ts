import { MigrationInterface, QueryRunner } from "typeorm"

export class addingTokenManagement1663606793784 implements MigrationInterface {
  name = "addingTokenManagement1663606793784"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD "active_access_token" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD "active_refresh_token" character varying`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "active_refresh_token"`)
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "active_access_token"`)
  }
}
