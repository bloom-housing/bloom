import { MigrationInterface, QueryRunner } from "typeorm"

export class addPartnerTermsToJurisdiction1639135587230 implements MigrationInterface {
  name = "addPartnerTermsToJurisdiction1639135587230"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jurisdictions" ADD "partner_terms" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jurisdictions" DROP COLUMN "partner_terms"`)
  }
}
