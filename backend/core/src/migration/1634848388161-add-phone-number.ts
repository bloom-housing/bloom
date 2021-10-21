import { MigrationInterface, QueryRunner } from "typeorm"

export class addPhoneNumber1634848388161 implements MigrationInterface {
  name = "addPhoneNumber1634848388161"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_accounts" ADD "phone_number" character varying`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "phone_number"`)
  }
}
