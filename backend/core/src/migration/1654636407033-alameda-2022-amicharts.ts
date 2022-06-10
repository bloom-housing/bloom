import { MigrationInterface, QueryRunner } from "typeorm"
import { alamedaTCAC2022 } from "../seeder/seeds/ami-charts/alameda-tcac-2022"
import { alamedaHUD2022 } from "../seeder/seeds/ami-charts/alameda-hud-2022"

export class alameda2022Amicharts1654636407033 implements MigrationInterface {
  name = "alameda2022Amicharts1654636407033"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ id }] = await queryRunner.query(`SELECT id FROM jurisdictions WHERE name = 'Alameda'`)
    await queryRunner.query(
      `INSERT INTO ami_chart
            (name, items, jurisdiction_id)
            VALUES ('${alamedaTCAC2022.name}', '${JSON.stringify(alamedaTCAC2022.items)}', '${id}')
          `
    )

    await queryRunner.query(
      `INSERT INTO ami_chart
            (name, items, jurisdiction_id)
            VALUES ('${alamedaHUD2022.name}', '${JSON.stringify(alamedaHUD2022.items)}', '${id}')
          `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
