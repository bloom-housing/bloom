import { MigrationInterface, QueryRunner } from "typeorm"

export class makeDobNullableInUserModel1632395374858 implements MigrationInterface {
  name = "makeDobNullableInUserModel1632395374858"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_accounts" ALTER COLUMN "dob" DROP NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_accounts" ALTER COLUMN "dob" SET NOT NULL`)
  }
}
