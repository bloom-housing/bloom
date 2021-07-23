import { MigrationInterface, QueryRunner } from "typeorm"

export class recreateForeignKeyConstraints1626268250228 implements MigrationInterface {
  name = "recreateForeignKeyConstraints1626268250228"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set_applications_applications" DROP CONSTRAINT "FK_bbae218ba0eff977157fad5ea31"`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set_applications_applications" DROP CONSTRAINT "FK_93f583f2d43fb21c5d7ceac57e7"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings_leasing_agents_user_accounts" DROP CONSTRAINT "FK_de53131bc8a08f824a5d3dd51e3"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings_leasing_agents_user_accounts" DROP CONSTRAINT "FK_f7b22af2c421e823f60c5f7d28b"`
    )
    await queryRunner.query(
      `ALTER TABLE "property_group_properties_property" DROP CONSTRAINT "FK_84e6a1949911510df0eff691f0d"`
    )
    await queryRunner.query(
      `ALTER TABLE "property_group_properties_property" DROP CONSTRAINT "FK_c99e75ee805d56fea44bf2970f2"`
    )
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "name" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set_applications_applications" ADD CONSTRAINT "FK_93f583f2d43fb21c5d7ceac57e7" FOREIGN KEY ("application_flagged_set_id") REFERENCES "application_flagged_set"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set_applications_applications" ADD CONSTRAINT "FK_bbae218ba0eff977157fad5ea31" FOREIGN KEY ("applications_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "listings_leasing_agents_user_accounts" ADD CONSTRAINT "FK_f7b22af2c421e823f60c5f7d28b" FOREIGN KEY ("listings_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "listings_leasing_agents_user_accounts" ADD CONSTRAINT "FK_de53131bc8a08f824a5d3dd51e3" FOREIGN KEY ("user_accounts_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "property_group_properties_property" ADD CONSTRAINT "FK_84e6a1949911510df0eff691f0d" FOREIGN KEY ("property_group_id") REFERENCES "property_group"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "property_group_properties_property" ADD CONSTRAINT "FK_c99e75ee805d56fea44bf2970f2" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "property_group_properties_property" DROP CONSTRAINT "FK_c99e75ee805d56fea44bf2970f2"`
    )
    await queryRunner.query(
      `ALTER TABLE "property_group_properties_property" DROP CONSTRAINT "FK_84e6a1949911510df0eff691f0d"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings_leasing_agents_user_accounts" DROP CONSTRAINT "FK_de53131bc8a08f824a5d3dd51e3"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings_leasing_agents_user_accounts" DROP CONSTRAINT "FK_f7b22af2c421e823f60c5f7d28b"`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set_applications_applications" DROP CONSTRAINT "FK_bbae218ba0eff977157fad5ea31"`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set_applications_applications" DROP CONSTRAINT "FK_93f583f2d43fb21c5d7ceac57e7"`
    )
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "name" DROP NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "property_group_properties_property" ADD CONSTRAINT "FK_c99e75ee805d56fea44bf2970f2" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "property_group_properties_property" ADD CONSTRAINT "FK_84e6a1949911510df0eff691f0d" FOREIGN KEY ("property_group_id") REFERENCES "property_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listings_leasing_agents_user_accounts" ADD CONSTRAINT "FK_f7b22af2c421e823f60c5f7d28b" FOREIGN KEY ("listings_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listings_leasing_agents_user_accounts" ADD CONSTRAINT "FK_de53131bc8a08f824a5d3dd51e3" FOREIGN KEY ("user_accounts_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set_applications_applications" ADD CONSTRAINT "FK_93f583f2d43fb21c5d7ceac57e7" FOREIGN KEY ("application_flagged_set_id") REFERENCES "application_flagged_set"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "application_flagged_set_applications_applications" ADD CONSTRAINT "FK_bbae218ba0eff977157fad5ea31" FOREIGN KEY ("applications_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }
}
