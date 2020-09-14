import { MigrationInterface, QueryRunner } from "typeorm"

export class addUniqueEmailConstraint1600106585058 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX user_accounts_email_unique_idx ON "user_accounts" (lower("email"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX user_accounts_email_unique_idx`)
  }
}
