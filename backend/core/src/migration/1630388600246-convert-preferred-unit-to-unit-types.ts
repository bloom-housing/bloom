import { MigrationInterface, QueryRunner } from "typeorm"

export class convertPreferredUnitToUnitTypes1630388600246 implements MigrationInterface {
  name = "convertPreferredUnitToUnitTypes1630388600246"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "applications_preferred_unit_unit_types" ("applications_id" uuid NOT NULL, "unit_types_id" uuid NOT NULL, CONSTRAINT "PK_63f7ac5b0db34696dd8c5098b87" PRIMARY KEY ("applications_id", "unit_types_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_8249d47edacc30250c18c53915" ON "applications_preferred_unit_unit_types" ("applications_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_5838635fbe9294cac64d1a0b60" ON "applications_preferred_unit_unit_types" ("unit_types_id") `
    )
    // get applications
    const applications = await queryRunner.query(`SELECT id, preferred_unit FROM applications`)
    // insert into applications_preferred_unit_unit_types
    console.log("applications = ", applications)
    for (const application of applications) {
      if (!applications?.preferred_unit) continue
      for (const unit of applications.preferred_unit) {
        await queryRunner.query(
          `INSERT INTO applications_preferred_unit_unit_types (applications_id, unit_types_id) SELECT '${application.id}', id FROM unit_types WHERE name = '${unit}'`
        )
      }
    }
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "preferred_unit"`)
    await queryRunner.query(
      `ALTER TABLE "applications_preferred_unit_unit_types" ADD CONSTRAINT "FK_8249d47edacc30250c18c53915a" FOREIGN KEY ("applications_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "applications_preferred_unit_unit_types" ADD CONSTRAINT "FK_5838635fbe9294cac64d1a0b605" FOREIGN KEY ("unit_types_id") REFERENCES "unit_types"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applications_preferred_unit_unit_types" DROP CONSTRAINT "FK_5838635fbe9294cac64d1a0b605"`
    )
    await queryRunner.query(
      `ALTER TABLE "applications_preferred_unit_unit_types" DROP CONSTRAINT "FK_8249d47edacc30250c18c53915a"`
    )
    await queryRunner.query(`ALTER TABLE "applications" ADD "preferred_unit" text array NOT NULL`)
    await queryRunner.query(`DROP INDEX "IDX_5838635fbe9294cac64d1a0b60"`)
    await queryRunner.query(`DROP INDEX "IDX_8249d47edacc30250c18c53915"`)
    await queryRunner.query(`DROP TABLE "applications_preferred_unit_unit_types"`)
  }
}
