import { MigrationInterface, QueryRunner } from "typeorm"

export class removeApplicationDueTime1641855882656 implements MigrationInterface {
  name = "removeApplicationDueTime1641855882656"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const listings = await queryRunner.query(
      `SELECT id, application_due_time, application_due_date from listings`
    )

    for (const listing of listings) {
      let dateTimeString = null

      // If existing due date, pull in existing time or set time as 5pm
      if (listing["application_due_date"]) {
        let dueDate = new Date(listing["application_due_date"])
        if (listing["application_due_time"]) {
          const dueTime = new Date(listing["application_due_time"])
          dueDate.setHours(dueTime.getHours())
        } else {
          dueDate.setHours(17, 0, 0, 0)
        }
        // Format date into db input format
        const modifiedDateString = dueDate.toISOString()
        const timeDelimiter = modifiedDateString.indexOf("T")
        const dateString = modifiedDateString.substr(0, timeDelimiter)
        const timeString = modifiedDateString.substr(timeDelimiter + 1)
        dateTimeString = `${dateString} ${timeString}`
      }

      await queryRunner.query("UPDATE listings SET application_due_date = ($1) WHERE id = ($2)", [
        dateTimeString,
        listing["id"],
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
