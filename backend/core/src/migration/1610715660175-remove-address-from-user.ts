import { MigrationInterface, QueryRunner } from "typeorm"

export class removeAddressFromUser1610715660175 implements MigrationInterface {
  name = "removeAddressFromUser1610715660175"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_accounts" DROP CONSTRAINT "FK_a72c6ee9575828fce562bd20a63"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_accounts" DROP CONSTRAINT "UQ_a72c6ee9575828fce562bd20a63"`
    )
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "address_id"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_accounts" ADD "address_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD CONSTRAINT "UQ_a72c6ee9575828fce562bd20a63" UNIQUE ("address_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD CONSTRAINT "FK_a72c6ee9575828fce562bd20a63" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
