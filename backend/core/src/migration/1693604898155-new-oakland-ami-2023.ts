import { MigrationInterface, QueryRunner } from "typeorm"
import { ami } from "../../scripts/ami-chart-import-files/oakland-2023"

export class newOaklandAmi20231693604898155 implements MigrationInterface {
  name = "newOaklandAmi20231693604898155"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ id }] = await queryRunner.query(`SELECT id FROM jurisdictions WHERE name = 'Alameda'`)

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
