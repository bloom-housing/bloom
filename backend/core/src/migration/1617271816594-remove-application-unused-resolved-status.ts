import { MigrationInterface, QueryRunner } from "typeorm"

export class removeApplicationUnusedResolvedStatus1617271816594 implements MigrationInterface {
  name = "removeApplicationUnusedResolvedStatus1617271816594"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" DROP CONSTRAINT "FK_23c3b0688a74c8c2c59e1016bf0"`
    )
    await queryRunner.query(`ALTER TABLE "application_flagged_set" DROP COLUMN "resolved"`)
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" DROP COLUMN "resolving_user_id_id"`
    )
    await queryRunner.query(`ALTER TABLE "application_flagged_set" ADD "resolving_user_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" ADD CONSTRAINT "FK_3aed12c210529ed798beee9d09e" FOREIGN KEY ("resolving_user_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" DROP CONSTRAINT "FK_3aed12c210529ed798beee9d09e"`
    )
    await queryRunner.query(`ALTER TABLE "application_flagged_set" DROP COLUMN "resolving_user_id"`)
    await queryRunner.query(`ALTER TABLE "application_flagged_set" ADD "resolving_user_id_id" uuid`)
    await queryRunner.query(`ALTER TABLE "application_flagged_set" ADD "resolved" boolean NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set" ADD CONSTRAINT "FK_23c3b0688a74c8c2c59e1016bf0" FOREIGN KEY ("resolving_user_id_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
