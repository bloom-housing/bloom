import { MigrationInterface, QueryRunner } from "typeorm"

export class addIsVerified1646847820396 implements MigrationInterface {
  name = "addIsVerified1646847820396"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" ADD "is_verified" boolean DEFAULT false`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "is_verified"`)
  }
}
