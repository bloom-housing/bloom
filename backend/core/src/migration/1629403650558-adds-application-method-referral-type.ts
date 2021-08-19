import { MigrationInterface, QueryRunner } from "typeorm"

export class addsApplicationMethodReferralType1629403650558 implements MigrationInterface {
  name = "addsApplicationMethodReferralType1629403650558"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "application_methods_type_enum" ADD VALUE 'Referral'`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // there is no equivalent statement to delete an enum value
    // see: https://stackoverflow.com/a/25812436
  }
}
