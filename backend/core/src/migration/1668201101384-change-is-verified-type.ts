import { MigrationInterface, QueryRunner } from "typeorm"

export class changeIsVerifiedType1668201101384 implements MigrationInterface {
  name = "changeIsVerifiedType1668201101384"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" ADD "verified_at" TIMESTAMP WITH TIME ZONE`)
    await queryRunner.query(
      `UPDATE "listings" SET "verified_at" = "updated_at" where is_verified = 'true'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "verified_at"`)
  }
}
