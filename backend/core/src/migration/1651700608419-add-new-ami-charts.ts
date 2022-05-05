import { MigrationInterface, QueryRunner } from "typeorm"
import { HUD2021 } from "../seeder/seeds/ami-charts/HUD2021"
import { HUD2022 } from "../seeder/seeds/ami-charts/HUD2022"
import { MSHDA2022 } from "../seeder/seeds/ami-charts/MSHDA2022"

export class addNewAmiCharts1651700608419 implements MigrationInterface {
  name = "addNewAmiCharts1651700608419"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ id }] = await queryRunner.query(`SELECT id FROM jurisdictions WHERE name = 'Detroit'`)

    await queryRunner.query(
      `INSERT INTO ami_chart
            (name, items, jurisdiction_id)
            VALUES ('${HUD2022.name}', '${JSON.stringify(HUD2022.items)}', '${id}')
          `
    )

    await queryRunner.query(
      `INSERT INTO ami_chart
              (name, items, jurisdiction_id)
              VALUES ('${MSHDA2022.name}', '${JSON.stringify(MSHDA2022.items)}', '${id}')
            `
    )

    await queryRunner.query(`UPDATE ami_chart SET items = $1 WHERE name = $2`, [
      JSON.stringify(HUD2021.items),
      "HUD 2021",
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
