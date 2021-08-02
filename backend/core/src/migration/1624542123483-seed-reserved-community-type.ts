import { MigrationInterface, QueryRunner } from "typeorm"

export class seedReservedCommunityType1624542123483 implements MigrationInterface {
  reservedCommunityTypes = ["specialNeeds", "senior55", "senior62"]
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const reservedCommunityType of this.reservedCommunityTypes) {
      await queryRunner.query(`INSERT INTO reserved_community_types (name) VALUES ($1)`, [
        reservedCommunityType,
      ])
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM reserved_community_types WHERE name = ANY($1)`, [
      this.reservedCommunityTypes,
    ])
  }
}
