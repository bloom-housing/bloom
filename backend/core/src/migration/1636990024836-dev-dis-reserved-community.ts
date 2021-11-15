import { MigrationInterface, QueryRunner } from "typeorm";

export class devDisReservedCommunity1636990024836 implements MigrationInterface {
  reservedType = "developmentalDisability"
  public async up(queryRunner: QueryRunner): Promise<void> {
    const jurisdictions = await queryRunner.query(`SELECT id from jurisdictions`)
    for (const jurisdiction of jurisdictions) {
      await queryRunner.query(`INSERT INTO reserved_community_types (name, jurisdiction_id) VALUES ($1, $2)`, [this.reservedType, jurisdiction.id])
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM reserved_community_types WHERE name = $1`, [
      this.reservedType,
    ])
  }

}
