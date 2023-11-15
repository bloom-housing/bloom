import { MigrationInterface, QueryRunner } from "typeorm"
import { ami } from "../../scripts/ami-chart-import-files/emeryville-2023"

export class emeryville2023AmiChart1699486370874 implements MigrationInterface {
  name = "emeryville2023AmiChart1699486370874"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ id: juris }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'Alameda'`
    )

    await queryRunner.query(`
              INSERT INTO ami_chart
              (name, items, jurisdiction_id)
              VALUES ('${ami.name}', '${JSON.stringify(ami.items)}', '${juris}')
          `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
