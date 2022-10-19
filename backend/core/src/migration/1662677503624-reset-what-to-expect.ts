import { MigrationInterface, QueryRunner } from "typeorm"

export class resetWhatToExpect1662677503624 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hbaDefaultNoPreferences =
      "Applicants will be contacted by the property agent in rank order until vacancies are filled. All of the information that you have provided will be verified and your eligibility confirmed. Your application will be removed from the waitlist if you have made any fraudulent statements. Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents."

    const hbaDefaultPreferences =
      "Applicants will be contacted by the property agent in rank order until vacancies are filled. All of the information that you have provided will be verified and your eligibility confirmed. Your application will be removed from the waitlist if you have made any fraudulent statements. If we cannot verify a housing preference that you have claimed, you will not receive the preference but will not be otherwise penalized. Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents."

    const listings = await queryRunner.query(`SELECT * FROM listings`)

    for (const l of listings) {
      if (
        l.what_to_expect === hbaDefaultNoPreferences ||
        l.what_to_expect === hbaDefaultPreferences
      ) {
        await queryRunner.query(`UPDATE listings SET what_to_expect = ($1) WHERE id = ($2)`, [
          null,
          l.id,
        ])
      }
    }
  }
  public async down(): Promise<void> {
    // There is no reconciliation here
  }
}
