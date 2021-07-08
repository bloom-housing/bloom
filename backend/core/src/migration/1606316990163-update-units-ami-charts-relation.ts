import { MigrationInterface, QueryRunner } from "typeorm"

export class updateUnitsAmiChartsRelation1606316990163 implements MigrationInterface {
  name = "updateUnitsAmiChartsRelation1606316990163"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "property" DROP CONSTRAINT "FK_d639fcd25af4127bc979d5146a9"`
    )
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "ami_chart_id"`)
    await queryRunner.query(`ALTER TABLE "units" ADD "ami_chart_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_35571c6bd2a1ff690201d1dff08" FOREIGN KEY ("ami_chart_id") REFERENCES "ami_chart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_35571c6bd2a1ff690201d1dff08"`)
    await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "ami_chart_id"`)
    await queryRunner.query(`ALTER TABLE "property" ADD "ami_chart_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "property" ADD CONSTRAINT "FK_d639fcd25af4127bc979d5146a9" FOREIGN KEY ("ami_chart_id") REFERENCES "ami_chart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
