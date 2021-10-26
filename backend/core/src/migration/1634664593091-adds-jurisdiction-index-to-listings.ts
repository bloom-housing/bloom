import { MigrationInterface, QueryRunner } from "typeorm"

export class addsJurisdictionIndexToListings1634664593091 implements MigrationInterface {
  name = "addsJurisdictionIndexToListings1634664593091"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_ba0026e02ecfe91791aed1a481" ON "listings" ("jurisdiction_id") `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_ba0026e02ecfe91791aed1a481"`)
  }
}
