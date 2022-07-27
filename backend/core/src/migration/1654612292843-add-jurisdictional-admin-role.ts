import { MigrationInterface, QueryRunner } from "typeorm"

export class addJurisdictionalAdminRole1654612292843 implements MigrationInterface {
  name = "addJurisdictionalAdminRole1654612292843"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD "is_jurisdictional_admin" boolean NOT NULL DEFAULT false`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "is_jurisdictional_admin"`)
  }
}
