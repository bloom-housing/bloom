import { MigrationInterface, QueryRunner } from "typeorm"

export class changeAmiPercentageToInteger1630699221778 implements MigrationInterface {
  name = "changeAmiPercentageToInteger1630699221778"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "units_summary" ALTER COLUMN "ami_percentage" TYPE integer USING ami_percentage::integer`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "units_summary" ALTER COLUMN "ami_percentage" TYPE text USING ami_percentage::text`
    )
  }
}
