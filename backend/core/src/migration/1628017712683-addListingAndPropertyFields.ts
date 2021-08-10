import { MigrationInterface, QueryRunner } from "typeorm"

export class addListingAndPropertyFields1628017712683 implements MigrationInterface {
  name = "addListingAndPropertyFields1628017712683"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "property" ADD "region" text`)
    await queryRunner.query(`ALTER TABLE "property" ADD "phone_number" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "hrd_id" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "owner_company" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "management_company" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "management_website" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "ami_percentage_min" integer`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "ami_percentage_max" integer`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "ami_percentage_max"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "ami_percentage_min"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "management_website"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "management_company"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "owner_company"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "hrd_id"`)
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "phone_number"`)
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "region"`)
  }
}
