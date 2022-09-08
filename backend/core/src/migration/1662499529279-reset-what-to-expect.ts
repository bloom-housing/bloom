import { MigrationInterface, QueryRunner } from "typeorm"

export class resetWhatToExpect1662499529279 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hbaDefault =
      "Applicants will be contacted by the property agent in rank order until vacancies are filled. All of the information that you have provided will be verified and your eligibility confirmed. Your application will be removed from the waitlist if you have made any fraudulent statements. Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents."

    const listings = await queryRunner.query(`SELECT * FROM listings`)

    for (const l of listings) {
      if (l.what_to_expect === hbaDefault) {
        await queryRunner.query(`UPDATE listings SET what_to_expect = ($1) WHERE id = ($2)`, [
          null,
          l.id,
        ])
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // There is no reconciliation here
  }
}
