import { MigrationInterface, QueryRunner } from "typeorm"

export class addFiveBedroom1671614554019 implements MigrationInterface {
  name = "addFiveBedroom1671614554019"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO "unit_types" (name, num_bedrooms) VALUES ('fiveBdrm', 5);`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "units" WHERE num_bedrooms=5`)
    await queryRunner.query(`DELETE FROM "unit_types" WHERE name='fiveBdrm'`)
  }
}
