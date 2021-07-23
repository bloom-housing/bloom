import { MigrationInterface, QueryRunner } from "typeorm"

export class AddRentalAssistanceToListing1600773730888 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" ADD COLUMN "rental_assistance" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "rental_assistance"`)
  }
}
