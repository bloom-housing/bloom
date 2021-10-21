import { MigrationInterface, QueryRunner } from "typeorm"

export class removePageFromListingProgramEntity1634830165326 implements MigrationInterface {
  name = "removePageFromListingProgramEntity1634830165326"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listing_programs" DROP COLUMN "page"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listing_programs" ADD "page" integer`)
  }
}
