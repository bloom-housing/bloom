import { MigrationInterface, QueryRunner } from "typeorm"

export class temporarilyRemoveApplicationPreferenceTable1612345865476
  implements MigrationInterface {
  name = "temporarilyRemoveApplicationPreferenceTable1612345865476"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applications" ADD "preferences" jsonb NOT NULL default '[]'::jsonb`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "preferences"`)
  }
}
