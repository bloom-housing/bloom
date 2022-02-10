import { MigrationInterface, QueryRunner } from "typeorm"

export class addPhoneNumberVerified1644441969354 implements MigrationInterface {
  name = "addPhoneNumberVerified1644441969354"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD COLUMN "phone_number_verified" BOOLEAN DEFAULT FALSE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "phone_number_verified"`)
  }
}
