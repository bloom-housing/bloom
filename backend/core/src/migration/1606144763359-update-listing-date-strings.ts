import { MigrationInterface, QueryRunner } from "typeorm"

export class updateListingDateStrings1606144763359 implements MigrationInterface {
  name = "updateListingDateStrings1606144763359"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "ami_chart_id"`)
    await queryRunner.query(`ALTER TABLE "alternate_contact" ADD "mailing_address_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "alternate_contact" ADD CONSTRAINT "UQ_5eb038a51b9cd6872359a687b18" UNIQUE ("mailing_address_id")`
    )
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_due_date"`)
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "application_due_date" TIMESTAMP WITH TIME ZONE`
    )
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_open_date"`)
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "application_open_date" TIMESTAMP WITH TIME ZONE`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP COLUMN "postmarked_applications_received_by_date"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "postmarked_applications_received_by_date" TIMESTAMP WITH TIME ZONE`
    )
    await queryRunner.query(
      `ALTER TABLE "alternate_contact" ADD CONSTRAINT "FK_5eb038a51b9cd6872359a687b18" FOREIGN KEY ("mailing_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "alternate_contact" DROP CONSTRAINT "FK_5eb038a51b9cd6872359a687b18"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP COLUMN "postmarked_applications_received_by_date"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "postmarked_applications_received_by_date" text`
    )
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_open_date"`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "application_open_date" text`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_due_date"`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "application_due_date" text`)
    await queryRunner.query(
      `ALTER TABLE "alternate_contact" DROP CONSTRAINT "UQ_5eb038a51b9cd6872359a687b18"`
    )
    await queryRunner.query(`ALTER TABLE "alternate_contact" DROP COLUMN "mailing_address_id"`)
    await queryRunner.query(`ALTER TABLE "units" ADD "ami_chart_id" integer`)
  }
}
