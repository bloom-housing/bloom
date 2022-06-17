import { MigrationInterface, QueryRunner } from "typeorm"
import { sanMateoHUD } from "../seeder/seeds/ami-charts/sanMateoHUD"
import { sanMateoTCAC } from "../seeder/seeds/ami-charts/sanMateoTCAC"

export class sanMateo2022AmiCharts1655229223560 implements MigrationInterface {
  name = "sanMateo2022AmiCharts1655229223560"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ id }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'San Mateo'`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ALTER COLUMN "rental_assistance_default" DROP DEFAULT`
    )

    await queryRunner.query(
      `INSERT INTO ami_chart
                  (name, items, jurisdiction_id)
                  VALUES ('${sanMateoHUD.name}', '${JSON.stringify(sanMateoHUD.items)}', '${id}')
                `
    )

    await queryRunner.query(
      `INSERT INTO ami_chart
                  (name, items, jurisdiction_id)
                  VALUES ('${sanMateoTCAC.name}', '${JSON.stringify(sanMateoTCAC.items)}', '${id}')
                `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
