import { MigrationInterface, QueryRunner } from "typeorm"

export class multiselectQuestion1658871879940 implements MigrationInterface {
  name = "multiselectQuestion1658871879940"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."multiselect_questions_application_section_enum" AS ENUM('programs', 'preferences')`
    )
    await queryRunner.query(
      `CREATE TABLE "multiselect_questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "text" text NOT NULL, "sub_text" text, "description" text, "links" jsonb, "options" jsonb, "opt_out_text" text, "hide_from_listing" boolean, "application_section" "public"."multiselect_questions_application_section_enum" NOT NULL, CONSTRAINT "PK_671931eccff7fb3b7cf2050cce0" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "listing_multiselect_questions" ("ordinal" integer, "listing_id" uuid NOT NULL, "multiselect_question_id" uuid NOT NULL, CONSTRAINT "PK_42d86daebffadee893f602506c2" PRIMARY KEY ("listing_id", "multiselect_question_id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "jurisdictions_multiselect_questions_multiselect_questions" ("jurisdictions_id" uuid NOT NULL, "multiselect_questions_id" uuid NOT NULL, CONSTRAINT "PK_b43958a0ef8fbfef97db9c23f8f" PRIMARY KEY ("jurisdictions_id", "multiselect_questions_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_3f7126f5da7c0368aea2f9459c" ON "jurisdictions_multiselect_questions_multiselect_questions" ("jurisdictions_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ab91e5d403a6cf21656f7d5ae2" ON "jurisdictions_multiselect_questions_multiselect_questions" ("multiselect_questions_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ALTER COLUMN "enable_accessibility_features" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ALTER COLUMN "enable_utilities_included" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_e5d5291cd6ab92cbec304aab905"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "UQ_e5d5291cd6ab92cbec304aab905" UNIQUE ("building_address_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "FK_d123697625fe564c2bae54dcecf" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "FK_92adcb35f2f14e316b4cb12a84e" FOREIGN KEY ("multiselect_question_id") REFERENCES "multiselect_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_e5d5291cd6ab92cbec304aab905" FOREIGN KEY ("building_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions" ADD CONSTRAINT "FK_3f7126f5da7c0368aea2f9459c0" FOREIGN KEY ("jurisdictions_id") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions" ADD CONSTRAINT "FK_ab91e5d403a6cf21656f7d5ae20" FOREIGN KEY ("multiselect_questions_id") REFERENCES "multiselect_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions" DROP CONSTRAINT "FK_ab91e5d403a6cf21656f7d5ae20"`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions" DROP CONSTRAINT "FK_3f7126f5da7c0368aea2f9459c0"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_e5d5291cd6ab92cbec304aab905"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "FK_92adcb35f2f14e316b4cb12a84e"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "FK_d123697625fe564c2bae54dcecf"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "UQ_e5d5291cd6ab92cbec304aab905"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_e5d5291cd6ab92cbec304aab905" FOREIGN KEY ("building_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ALTER COLUMN "enable_utilities_included" SET DEFAULT false`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ALTER COLUMN "enable_accessibility_features" SET DEFAULT false`
    )
    await queryRunner.query(`DROP INDEX "public"."IDX_ab91e5d403a6cf21656f7d5ae2"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_3f7126f5da7c0368aea2f9459c"`)
    await queryRunner.query(
      `DROP TABLE "jurisdictions_multiselect_questions_multiselect_questions"`
    )
    await queryRunner.query(`DROP TABLE "listing_multiselect_questions"`)
    await queryRunner.query(`DROP TABLE "multiselect_questions"`)
    await queryRunner.query(`DROP TYPE "public"."multiselect_questions_application_section_enum"`)
  }
}
