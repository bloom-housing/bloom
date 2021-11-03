import { MigrationInterface, QueryRunner } from "typeorm"

export class addJurisdictionRelationToAmiCharts1632987393556 implements MigrationInterface {
  name = "addJurisdictionRelationToAmiCharts1632987393556"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ami_chart" ADD "jurisdiction_id" uuid`)
    const [{ id: jurisdictionId }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'Detroit' LIMIT 1`
    )
    await queryRunner.query(`UPDATE ami_chart SET jurisdiction_id = $1`, [jurisdictionId])
    await queryRunner.query(`ALTER TABLE "ami_chart" ALTER COLUMN "jurisdiction_id" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "ami_chart" ADD CONSTRAINT "FK_5566b52b2e7c0056e3b81c171f1" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ami_chart" DROP CONSTRAINT "FK_5566b52b2e7c0056e3b81c171f1"`
    )
    await queryRunner.query(`ALTER TABLE "ami_chart" DROP COLUMN "jurisdiction_id"`)
  }
}
