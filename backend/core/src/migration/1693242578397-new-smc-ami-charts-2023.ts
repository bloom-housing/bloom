import { MigrationInterface, QueryRunner } from "typeorm"
import { ami as SMC_HUD_2023 } from "../../scripts/ami-chart-import-files/SMC-HUD-2023"
import { ami as SMC_TCAC_2023 } from "../../scripts/ami-chart-import-files/SMC-TCAC-2023"

export class newSmcAmiCharts20231693242578397 implements MigrationInterface {
  name = "newSmcAmiCharts20231693242578397"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ id: smcJuris }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'San Mateo'`
    )

    await queryRunner.query(`
        INSERT INTO ami_chart
        (name, items, jurisdiction_id)
        VALUES ('${SMC_HUD_2023.name}', '${JSON.stringify(SMC_HUD_2023.items)}', '${smcJuris}')
    `)

    await queryRunner.query(`
        INSERT INTO ami_chart
        (name, items, jurisdiction_id)
        VALUES ('${SMC_TCAC_2023.name}', '${JSON.stringify(SMC_TCAC_2023.items)}', '${smcJuris}')
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // there is no down migration
  }
}
