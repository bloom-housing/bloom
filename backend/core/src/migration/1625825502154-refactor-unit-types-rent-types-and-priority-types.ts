import { MigrationInterface, QueryRunner } from "typeorm"

export class refactorUnitTypesRentTypesAndPriorityTypes1625825502154 implements MigrationInterface {
  name = "refactorUnitTypesRentTypesAndPriorityTypes1625825502154"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "unit_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "PK_105c42fcf447c1da21fd20bcb85" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "units" ADD "unit_type_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_1e193f5ffdda908517e47d4e021" FOREIGN KEY ("unit_type_id") REFERENCES "unit_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    for (const unitType of ["studio", "oneBdrm", "twoBdrm", "threeBdrm", "fourBdrm"]) {
      const [
        newUnitType,
      ] = await queryRunner.query(`INSERT INTO "unit_types" (name) VALUES ($1) RETURNING id`, [
        unitType,
      ])
      const unitsToBeUpdated = await queryRunner.query(
        `SELECT id FROM units where unit_type = ($1)`,
        [unitType]
      )
      for (const unit of unitsToBeUpdated) {
        await queryRunner.query(`UPDATE units SET unit_type_id = ($1) WHERE id = ($2)`, [
          newUnitType.id,
          unit.id,
        ])
      }
    }
    await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "unit_type"`)

    await queryRunner.query(
      `CREATE TABLE "unit_accessibility_priority_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "PK_2cf31d2ceea36e6a6b970608565" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "units" ADD "priority_type_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_6981f323d01ba8d55190480078d" FOREIGN KEY ("priority_type_id") REFERENCES "unit_accessibility_priority_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    for (const accessibilityPriorityType of [
      "Mobility and Hearing & Visual",
      "Mobility and Mobility with Hearing & Visual",
      "Mobility and hearing",
      "Mobility",
      "mobility",
    ]) {
      const [
        newAccessibilityPriorityType,
      ] = await queryRunner.query(
        `INSERT INTO "unit_accessibility_priority_types" (name) VALUES ($1) RETURNING id`,
        [accessibilityPriorityType]
      )
      const unitsToBeUpdated = await queryRunner.query(
        `SELECT id FROM units where priority_type = ($1)`,
        [accessibilityPriorityType]
      )
      for (const unit of unitsToBeUpdated) {
        await queryRunner.query(`UPDATE units SET priority_type_id = ($1) WHERE id = ($2)`, [
          newAccessibilityPriorityType.id,
          unit.id,
        ])
      }
    }
    await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "priority_type"`)

    await queryRunner.query(
      `CREATE TABLE "unit_rent_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "PK_fb6b318fdee0a5b30521f63c516" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "units" ADD "unit_rent_type_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_ff9559bf9a1daecef4a89bad4a9" FOREIGN KEY ("unit_rent_type_id") REFERENCES "unit_rent_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    for (const unitRentType of ["fixed", "percentageOfIncome"]) {
      await queryRunner.query(`INSERT INTO "unit_rent_types" (name) VALUES ($1)`, [unitRentType])
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_6981f323d01ba8d55190480078d"`)
    await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_ff9559bf9a1daecef4a89bad4a9"`)
    await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_1e193f5ffdda908517e47d4e021"`)
    await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "priority_type_id"`)
    await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "unit_rent_type_id"`)
    await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "unit_type_id"`)
    await queryRunner.query(`ALTER TABLE "units" ADD "unit_type" text`)
    await queryRunner.query(`ALTER TABLE "units" ADD "priority_type" text`)
    await queryRunner.query(`DROP TABLE "unit_accessibility_priority_types"`)
    await queryRunner.query(`DROP TABLE "unit_rent_types"`)
    await queryRunner.query(`DROP TABLE "unit_types"`)
  }
}
