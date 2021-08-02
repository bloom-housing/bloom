import { MigrationInterface, QueryRunner } from "typeorm"

export class removeReservedTypeFromUnits1626897520264 implements MigrationInterface {
  name = "removeReservedTypeFromUnits1626897520264"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "reserved_type"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "units" ADD "reserved_type" text`)
  }
}
