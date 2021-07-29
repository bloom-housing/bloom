import { MigrationInterface, QueryRunner } from "typeorm"

export class unitStatusEnum1626207809474 implements MigrationInterface {
  name = "unitStatusEnum1626207809474"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "units_status_enum" AS ENUM('unknown', 'available', 'occupied')`
    )
    await queryRunner.query(
      `ALTER TABLE "units" ALTER COLUMN "status" TYPE "units_status_enum" using "status"::"units_status_enum"`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "status" TYPE text`)
    await queryRunner.query(`DROP TYPE "units_status_enum"`)
  }
}
