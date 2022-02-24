import { MigrationInterface, QueryRunner } from "typeorm"

export class addProgramJsonbToApplication1634547352243 implements MigrationInterface {
  name = "addProgramJsonbToApplication1634547352243"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applications" ADD "programs" jsonb`)
    await queryRunner.query(`ALTER TABLE "programs" ADD "form_metadata" jsonb`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "programs" DROP COLUMN "form_metadata"`)
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "programs"`)
  }
}
