import { MigrationInterface, QueryRunner } from "typeorm"

export class makeApplicationLanguageNullable1609755983577 implements MigrationInterface {
  name = "makeApplicationLanguageNullable1609755983577"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "language" DROP NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applications" ALTER COLUMN "language" SET NOT NULL`)
  }
}
