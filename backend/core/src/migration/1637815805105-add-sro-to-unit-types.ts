import { MigrationInterface, QueryRunner } from "typeorm"

export class addSroToUnitTypes1637815805105 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO unit_types (name, num_bedrooms) VALUES ($1, $2)`, [
      "SRO",
      0,
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM unit_types WHERE name = $1`, ["SRO"])
  }
}
