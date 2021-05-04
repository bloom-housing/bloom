import { MigrationInterface, QueryRunner } from "typeorm"

export class addMissingConstraints1617314453753 implements MigrationInterface {
  name = "addMissingConstraints1617314453753"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "user_accounts"."email" IS NULL`)
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD CONSTRAINT "UQ_df3802ec9c31dd9491e3589378d" UNIQUE ("email")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_accounts" DROP CONSTRAINT "UQ_df3802ec9c31dd9491e3589378d"`
    )
    await queryRunner.query(`COMMENT ON COLUMN "user_accounts"."email" IS NULL`)
  }
}
