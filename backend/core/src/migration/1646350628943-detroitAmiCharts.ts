import { MigrationInterface, QueryRunner } from "typeorm"
import { HUD2021 } from "../seeder/seeds/ami-charts/HUD2021"
import { MSHDA2021 } from "../seeder/seeds/ami-charts/MSHDA2021"

export class detroitAmiCharts1646350628943 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ id }] = await queryRunner.query(`SELECT id FROM jurisdictions WHERE name = 'Detroit'`)

    await queryRunner.query(
      `INSERT INTO ami_chart
            (name, items, jurisdiction_id)
            VALUES ('${HUD2021.name}', '${JSON.stringify(HUD2021.items)}', '${id}')
          `
    )

    await queryRunner.query(
      `INSERT INTO ami_chart
            (name, items, jurisdiction_id)
            VALUES ('${MSHDA2021.name}', '${JSON.stringify(MSHDA2021.items)}', '${id}')
          `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
