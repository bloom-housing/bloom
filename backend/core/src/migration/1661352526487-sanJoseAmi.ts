import {MigrationInterface, QueryRunner} from "typeorm"
import { sanJoseHcdIncomeLimits2022 } from "../seeder/seeds/ami-charts/san-jose-hcd-income-limits-2022"
import { sanJoseHudHome2022 } from "../seeder/seeds/ami-charts/san-jose-hud-home-2022"

export class sanJoseAmi1661352526487 implements MigrationInterface {
    name = "sanJoseAmi1661352526487"
    public async up(queryRunner: QueryRunner): Promise<void> {
        const [{ id }] = await queryRunner.query(`SELECT id FROM jurisdictions WHERE name = 'San Jose'`)

        await queryRunner.query(
        `INSERT INTO ami_chart
                (name, items, jurisdiction_id)
                VALUES ('${sanJoseHcdIncomeLimits2022.name}', '${JSON.stringify(sanJoseHcdIncomeLimits2022.items)}', '${id}')
            `
        )

        await queryRunner.query(
        `INSERT INTO ami_chart
                (name, items, jurisdiction_id)
                VALUES ('${sanJoseHudHome2022.name}', '${JSON.stringify(sanJoseHudHome2022.items)}', '${id}')
                `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
