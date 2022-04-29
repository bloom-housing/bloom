import { MigrationInterface, QueryRunner } from "typeorm"
import { ListingMarketingTypeEnum } from "../listings/types/listing-marketing-type-enum"

export class addWhatToExpectAdditionalTextForComingSoon1651191466791 implements MigrationInterface {
  name = "addWhatToExpectAdditionalTextForComingSoon1651191466791"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const defaultWhatToExpect = `This property is still under construction by the property owners. If you sign up for notifications through Detroit Home Connect, we will send you updates when this property has opened up applications for residents. You can also check back later to this page for updates.`
    await queryRunner.query(
      `UPDATE listings SET what_to_expect = ($1) WHERE marketing_type = ($2)`,
      [defaultWhatToExpect, ListingMarketingTypeEnum.ComingSoon]
    )
    await queryRunner.query(
      `UPDATE listings SET what_to_expect_additional_text = ($1) WHERE marketing_type = ($2)`,
      [null, ListingMarketingTypeEnum.ComingSoon]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
