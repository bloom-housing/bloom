import { MigrationInterface, QueryRunner } from "typeorm"

export class removeSRO1656457788192 implements MigrationInterface {
  name = "removeSRO1656457788192"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "UPDATE unit_group_unit_type_unit_types SET unit_types_id = (SELECT id FROM unit_types WHERE name = 'studio') WHERE unit_types_id = (SELECT id FROM unit_types WHERE name = 'SRO')"
    )
    await queryRunner.query(`DELETE FROM unit_types WHERE name = $1`, ["SRO"])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO unit_types (name, num_bedrooms) VALUES ($1, $2)`, [
      "SRO",
      0,
    ])
  }
}
