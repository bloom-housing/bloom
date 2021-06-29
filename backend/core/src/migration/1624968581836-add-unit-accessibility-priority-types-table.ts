import { MigrationInterface, QueryRunner } from "typeorm"

export class addUnitAccessibilityPriorityTypesTable1624968581836 implements MigrationInterface {
  name = "addUnitAccessibilityPriorityTypesTable1624968581836"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "unit_accessibility_priority_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "PK_2cf31d2ceea36e6a6b970608565" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "units" ADD "unit_accessibility_priority_type_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_a56c4b6b4f72a563b293e675ae6" FOREIGN KEY ("unit_accessibility_priority_type_id") REFERENCES "unit_accessibility_priority_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    for (const unitAccessibilityPriorityType of ["mobility"]) {
      await queryRunner.query(
        `INSERT INTO "unit_accessibility_priority_types" (name) VALUES ($1)`,
        [unitAccessibilityPriorityType]
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_a56c4b6b4f72a563b293e675ae6"`)
    await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "unit_accessibility_priority_type_id"`)
    await queryRunner.query(`DROP TABLE "unit_accessibility_priority_types"`)
  }
}
