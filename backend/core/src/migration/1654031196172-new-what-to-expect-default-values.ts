import { MigrationInterface, QueryRunner } from "typeorm"
import { ListingMarketingTypeEnum } from "../listings/types/listing-marketing-type-enum"

export class newWhatToExpectDefaultValues1654031196172 implements MigrationInterface {
  name = "newWhatToExpectDefaultValues1654031196172"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const defaultComingSoonWhatToExpect = `This property is still under development by the property owners. If you sign up for notifications through Detroit Home Connect, we will send you updates when this property has opened up applications for residents. You can also check back later to this page for updates.`
    const defaultComingSoonAdditionalWhatToExpect = null
    const defaultMarketingWhatToExpect = `<div><div className="mb-3">If you are interested in applying for this property, please get in touch in one of these ways:</div><div><ul class="list-disc pl-6"><li>Phone</li><li>Email</li><li>In-person</li><li>In some instances, the property has a link directly to an application</li></ul></div><div className="mt-2">Once you contact a property, ask if they have any available units if you are looking to move in immediately.</div><div className="mt-2"><strong>Waitlists</strong>:<div>If none are available, but you are still interested in eventually living at the property, ask how you can be placed on their waitlist.</div>`
    const defaultMarketingAdditionalWhatToExpect = `<ul className="list-disc pl-6"><li>Property staff should walk you through the process to get on their waitlist.</li><li>You can be on waitlists for multiple properties, but you will need to contact each one of them to begin that process.</li><li>Even if you are on a waitlist, it can take months or over a year to get an available unit for that building.</li><li>Many properties that are affordable because of government funding or agreements have long waitlists. If you're on a waitlist for a property, you should contact the property on a regular basis to see if any units are available.</li></ul>`
    await queryRunner.query(
      `UPDATE listings SET what_to_expect = ($1) WHERE marketing_type = ($2)`,
      [defaultComingSoonWhatToExpect, ListingMarketingTypeEnum.ComingSoon]
    )
    await queryRunner.query(
      `UPDATE listings SET what_to_expect_additional_text = ($1) WHERE marketing_type = ($2)`,
      [defaultComingSoonAdditionalWhatToExpect, ListingMarketingTypeEnum.ComingSoon]
    )
    await queryRunner.query(
      `UPDATE listings SET what_to_expect = ($1) WHERE marketing_type = ($2)`,
      [defaultMarketingWhatToExpect, ListingMarketingTypeEnum.Marketing]
    )
    await queryRunner.query(
      `UPDATE listings SET what_to_expect_additional_text = ($1) WHERE marketing_type = ($2)`,
      [defaultMarketingAdditionalWhatToExpect, ListingMarketingTypeEnum.Marketing]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
