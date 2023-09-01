import { MigrationInterface, QueryRunner } from "typeorm"
import { ami } from "../../scripts/ami-chart-import-files/oakland-2023"

export class newOaklandAmiChart20231693243858535 implements MigrationInterface {
  name = "newOaklandAmiChart20231693243858535"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ id }] = await queryRunner.query(`SELECT id FROM jurisdictions WHERE name = 'Bay Area'`)

    await queryRunner.query(`
        INSERT INTO ami_chart
        (name, items, jurisdiction_id)
        VALUES ('${ami.name}', '${JSON.stringify(ami.items)}', '${id}')
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // there is no down migration
  }
}
