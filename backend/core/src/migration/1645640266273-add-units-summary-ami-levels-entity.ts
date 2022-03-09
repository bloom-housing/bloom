import { MigrationInterface, QueryRunner } from "typeorm"

export class addUnitsSummaryAmiLevelsEntity1645640266273 implements MigrationInterface {
  name = "addUnitsSummaryAmiLevelsEntity1645640266273"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE units_summary RENAME TO unit_group`)
    await queryRunner.query(
      `CREATE TYPE "unit_group_ami_levels_monthly_rent_determination_type_enum" AS ENUM('flatRent', 'percentageOfIncome')`
    )
    await queryRunner.query(
      `CREATE TABLE "unit_group_ami_levels" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ami_percentage" integer NOT NULL, "monthly_rent_determination_type" "unit_group_ami_levels_monthly_rent_determination_type_enum" NOT NULL, "flat_rent_value" numeric(8,2), "percentage_of_income_value" integer, "ami_chart_id" uuid, "unit_group_id" uuid, CONSTRAINT "PK_4b540cae0d35b199c0448610378" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "unit_group_unit_type_unit_types" ("unit_group_id" uuid NOT NULL, "unit_types_id" uuid NOT NULL, CONSTRAINT "PK_4f2d90a894495a3cb72e5f0d2c8" PRIMARY KEY ("unit_group_id", "unit_types_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_1951c380e8091486b980008886" ON "unit_group_unit_type_unit_types" ("unit_group_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_b905b8bda3171b06c7a5d4d671" ON "unit_group_unit_type_unit_types" ("unit_types_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group" DROP COLUMN "monthly_rent_as_percent_of_income"`
    )
    await queryRunner.query(`ALTER TABLE "unit_group" DROP COLUMN "ami_percentage"`)
    await queryRunner.query(`ALTER TABLE "unit_group" DROP COLUMN "minimum_income_min"`)
    await queryRunner.query(`ALTER TABLE "unit_group" DROP COLUMN "minimum_income_max"`)
    await queryRunner.query(`ALTER TABLE "unit_group" DROP COLUMN "unit_type_id"`)
    await queryRunner.query(`ALTER TABLE "unit_group" DROP COLUMN "monthly_rent_min"`)
    await queryRunner.query(`ALTER TABLE "unit_group" DROP COLUMN "monthly_rent_max"`)
    await queryRunner.query(`ALTER TABLE "unit_group" ADD "bathroom_min" integer`)
    await queryRunner.query(`ALTER TABLE "unit_group" ADD "bathroom_max" integer`)
    await queryRunner.query(
      `ALTER TABLE "unit_group" ADD "open_waitlist" boolean NOT NULL DEFAULT true`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_ami_levels" ADD CONSTRAINT "FK_859a749beeb93898cfe3aa318e7" FOREIGN KEY ("ami_chart_id") REFERENCES "ami_chart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_ami_levels" ADD CONSTRAINT "FK_c15eff18d0384540366861a1c9c" FOREIGN KEY ("unit_group_id") REFERENCES "unit_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_unit_type_unit_types" ADD CONSTRAINT "FK_1951c380e8091486b9800088865" FOREIGN KEY ("unit_group_id") REFERENCES "unit_group"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_unit_type_unit_types" ADD CONSTRAINT "FK_b905b8bda3171b06c7a5d4d6712" FOREIGN KEY ("unit_types_id") REFERENCES "unit_types"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE unit_group RENAME TO units_summary`)
    await queryRunner.query(
      `ALTER TABLE "units_summary_unit_type_unit_types" DROP CONSTRAINT "FK_b905b8bda3171b06c7a5d4d6712"`
    )
    await queryRunner.query(
      `ALTER TABLE "units_summary_unit_type_unit_types" DROP CONSTRAINT "FK_1951c380e8091486b9800088865"`
    )
    await queryRunner.query(
      `ALTER TABLE "units_summary_ami_levels" DROP CONSTRAINT "FK_c15eff18d0384540366861a1c9c"`
    )
    await queryRunner.query(
      `ALTER TABLE "units_summary_ami_levels" DROP CONSTRAINT "FK_859a749beeb93898cfe3aa318e7"`
    )
    await queryRunner.query(`ALTER TABLE "units_summary" DROP COLUMN "open_waitlist"`)
    await queryRunner.query(`ALTER TABLE "units_summary" DROP COLUMN "bathroom_max"`)
    await queryRunner.query(`ALTER TABLE "units_summary" DROP COLUMN "bathroom_min"`)
    await queryRunner.query(`ALTER TABLE "units_summary" ADD "monthly_rent_max" integer`)
    await queryRunner.query(`ALTER TABLE "units_summary" ADD "monthly_rent_min" integer`)
    await queryRunner.query(`ALTER TABLE "units_summary" ADD "unit_type_id" uuid`)
    await queryRunner.query(`ALTER TABLE "units_summary" ADD "minimum_income_max" text`)
    await queryRunner.query(`ALTER TABLE "units_summary" ADD "minimum_income_min" text`)
    await queryRunner.query(`ALTER TABLE "units_summary" ADD "ami_percentage" integer`)
    await queryRunner.query(
      `ALTER TABLE "units_summary" ADD "monthly_rent_as_percent_of_income" numeric(8,2)`
    )
    await queryRunner.query(`DROP INDEX "IDX_b905b8bda3171b06c7a5d4d671"`)
    await queryRunner.query(`DROP INDEX "IDX_1951c380e8091486b980008886"`)
    await queryRunner.query(`DROP TABLE "units_summary_unit_type_unit_types"`)
    await queryRunner.query(`DROP TABLE "units_summary_ami_levels"`)
    await queryRunner.query(
      `DROP TYPE "units_summary_ami_levels_monthly_rent_determination_type_enum"`
    )
    await queryRunner.query(
      `ALTER TABLE "units_summary" ADD CONSTRAINT "FK_0eae6ec11a6109496d80d9a88f9" FOREIGN KEY ("unit_type_id") REFERENCES "unit_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
