import { MigrationInterface, QueryRunner } from "typeorm"

export class cascadeDeleteMultiselectQuestion1662675176872 implements MigrationInterface {
  name = "cascadeDeleteMultiselectQuestion1662675176872"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions" DROP CONSTRAINT "FK_ab91e5d403a6cf21656f7d5ae20"`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions" ADD CONSTRAINT "FK_ab91e5d403a6cf21656f7d5ae20" FOREIGN KEY ("multiselect_questions_id") REFERENCES "multiselect_questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions" DROP CONSTRAINT "FK_ab91e5d403a6cf21656f7d5ae20"`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions_multiselect_questions_multiselect_questions" ADD CONSTRAINT "FK_ab91e5d403a6cf21656f7d5ae20" FOREIGN KEY ("multiselect_questions_id") REFERENCES "multiselect_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }
}
