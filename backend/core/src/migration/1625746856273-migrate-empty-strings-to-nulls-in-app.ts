import { MigrationInterface, QueryRunner } from "typeorm"

export class migrateEmptyStringsToNullsInApp1625746856273 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE applicant SET last_name = NULL where last_name = ''`)
    await queryRunner.query(`UPDATE applicant SET first_name = NULL where first_name = ''`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE applicant SET first_name = '' where first_name = NULL`)
    await queryRunner.query(`UPDATE applicant SET last_name = '' where last_name = NULL`)
  }
}
