import { MigrationInterface, QueryRunner } from "typeorm"

export class sqFootToNumber1646866933450 implements MigrationInterface {
  name = "sqFootToNumber1646866933450"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "unit_group" DROP COLUMN "sq_feet_min"`)
    await queryRunner.query(`ALTER TABLE "unit_group" ADD "sq_feet_min" integer`)
    await queryRunner.query(`ALTER TABLE "unit_group" DROP COLUMN "sq_feet_max"`)
    await queryRunner.query(`ALTER TABLE "unit_group" ADD "sq_feet_max" integer`)
    await queryRunner.query(`ALTER TABLE "unit_group_ami_levels" DROP COLUMN "flat_rent_value"`)
    await queryRunner.query(`ALTER TABLE "unit_group_ami_levels" ADD "flat_rent_value" integer`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "unit_group" DROP COLUMN "sq_feet_max"`)
    await queryRunner.query(`ALTER TABLE "unit_group" ADD "sq_feet_max" numeric(8,2)`)
    await queryRunner.query(`ALTER TABLE "unit_group" DROP COLUMN "sq_feet_min"`)
    await queryRunner.query(`ALTER TABLE "unit_group" ADD "sq_feet_min" numeric(8,2)`)
    await queryRunner.query(`ALTER TABLE "unit_group_ami_levels" DROP COLUMN "flat_rent_value"`)
    await queryRunner.query(
      `ALTER TABLE "unit_group_ami_levels" ADD "flat_rent_value" numeric(8,2)`
    )
  }
}
