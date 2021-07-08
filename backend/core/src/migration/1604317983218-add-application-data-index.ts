import { MigrationInterface, QueryRunner } from "typeorm"

export class addApplicationDataIndex1604317983218 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX ON "applications" USING GIN ( to_tsvector('english', application) )`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX applications_to_tsvector_idx`)
  }
}
