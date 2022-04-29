import { MigrationInterface, QueryRunner } from "typeorm"

export class addWhatToExpectAdditionalText1649893064530 implements MigrationInterface {
  name = "addWhatToExpectAdditionalText1649893064530"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const defaultWhatToExpect = `<div><strong>Vacant Units</strong>:<div className="mb-3">If you are looking to move in immediately, contact the property and ask if they have any vacant units.</div><div><strong>Waitlists</strong>:<div>If none are vacant, but you are still interested in living at the property in the future, ask how you can be placed on their waitlist.</div>`
    const defaultWhatToExpectAdditionalText = `<ul className="list-disc pl-6"><li>Property staff should walk you through the process to get on their waitlist.</li><li>You can be on waitlists for multiple properties, but you will need to contact each one of them to begin that process.</li><li>Even if you are on a waitlist, it can take months or over a year to get an available unit for that building.</li><li>Many properties that are affordable because of government funding or agreements have long waitlists. If you're on a waitlist for a property, you will be notified as available units come up.</li></ul>`
    await queryRunner.query(`ALTER TABLE "listings" ADD "what_to_expect_additional_text" text`)

    await queryRunner.query(`UPDATE listings SET what_to_expect = ($1)`, [defaultWhatToExpect])
    await queryRunner.query(`UPDATE listings SET what_to_expect_additional_text = ($1)`, [
      defaultWhatToExpectAdditionalText,
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "what_to_expect_additional_text"`)
  }
}
