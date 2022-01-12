import { MigrationInterface, QueryRunner } from "typeorm"

export class removeApplicationDueTime1641855882656 implements MigrationInterface {
  name = "removeApplicationDueTime1641855882656"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const listings = await queryRunner.query(`SELECT id from listings`)

    for (const listing of listings) {
      const existingDate = new Date(listing.application_due_date)
      const existingTime = new Date(listing.application_due_time)

      // Add 5pm default
      const consolidatedDateTime = listing.application_due_time
        ? new Date(existingDate.setTime(existingTime.getTime())).toISOString()
        : listing.application_due_date

      await queryRunner.query("UPDATE listings SET application_due_date = ($1) WHERE id = ($2)", [
        consolidatedDateTime,
        listing.id,
      ])
    }
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_due_time"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "application_due_time" TIMESTAMP WITH TIME ZONE`
    )
  }
}
