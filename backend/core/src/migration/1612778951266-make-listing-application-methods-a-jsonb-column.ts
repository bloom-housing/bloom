import { MigrationInterface, QueryRunner } from "typeorm"

export class makeListingApplicationMethodsAJsonbColumn1612778951266 implements MigrationInterface {
  name = "makeListingApplicationMethodsAJsonbColumn1612778951266"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "application_methods" jsonb NOT NULL default '[]'::jsonb`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_methods"`)
  }
}
