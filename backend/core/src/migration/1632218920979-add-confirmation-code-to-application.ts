import { MigrationInterface, QueryRunner } from "typeorm"
import crypto from "crypto"

export class addConfirmationCodeToApplication1632218920979 implements MigrationInterface {
  name = "addConfirmationCodeToApplication1632218920979"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applications" ADD "confirmation_code" text`)
    const applications = await queryRunner.query(`SELECT id, confirmation_code FROM applications`)
    for (const application of applications) {
      const randomConfirmationCode = crypto.randomBytes(4).toString("hex").toUpperCase()
      await queryRunner.query(`UPDATE applications SET confirmation_code = $1 WHERE id = $2`, [
        randomConfirmationCode,
        application.id,
      ])
    }
    await queryRunner.query(
      `ALTER TABLE "applications" ALTER COLUMN "confirmation_code" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "UQ_556c258a4439f1b7f53de2ed74f" UNIQUE ("listing_id", "confirmation_code")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "UQ_556c258a4439f1b7f53de2ed74f"`
    )
    await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "confirmation_code"`)
  }
}
