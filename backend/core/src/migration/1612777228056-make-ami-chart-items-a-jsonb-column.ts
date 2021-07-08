import { MigrationInterface, QueryRunner } from "typeorm"

export class makeAmiChartItemsAJsonbColumn1612777228056 implements MigrationInterface {
  name = "makeAmiChartItemsAJsonbColumn1612777228056"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ami_chart" ADD "items" jsonb NOT NULL default '[]'::jsonb`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ami_chart" DROP COLUMN "items"`)
  }
}
