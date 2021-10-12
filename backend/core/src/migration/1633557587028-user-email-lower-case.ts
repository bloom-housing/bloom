import { MigrationInterface, QueryRunner } from "typeorm"

export class userEmailLowerCase1633557587028 implements MigrationInterface {
  name = "userEmailLowerCase1633557587028"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "user_accounts" SET email = lower(email)`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "user_accounts" SET email = lower(email)`)
  }
}
