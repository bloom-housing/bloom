import { MigrationInterface, QueryRunner } from "typeorm"

export class addFiveBedroom1671614554019 implements MigrationInterface {
  name = "addFiveBedroom1671614554019"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const unitTypes: Array<{
      id: string
      created_at: string
      updated_at: string
      name: string
      num_bedrooms: string
    }> = await queryRunner.query(`SELECT * FROM "unit_types"`)

    const sro = unitTypes[unitTypes.length - 1]

    await queryRunner.query(`DELETE FROM "unit_types" WHERE id = '${sro.id}'`)
    await queryRunner.query(`INSERT INTO "unit_types" (name, num_bedrooms) VALUES ('fiveBdrm', 5);`)
    await queryRunner.query(
      `INSERT INTO "unit_types" (id, created_at, updated_at, name, num_bedrooms) VALUES (($1), ($2), ($3), ($4), ($5));`,
      [sro.id, sro.created_at, sro.updated_at, sro.name, sro.num_bedrooms]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "units" WHERE num_bedrooms=5`)
    await queryRunner.query(`DELETE FROM "unit_types" WHERE name='fiveBdrm'`)
  }
}
