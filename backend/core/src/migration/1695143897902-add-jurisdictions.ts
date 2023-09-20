import { MigrationInterface, QueryRunner } from "typeorm"

export class addJurisdictions1695143897902 implements MigrationInterface {
  name = "addJurisdictions1695143897902"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const baseJurisdiction = (
      await queryRunner.query(
        `SELECT * 
        FROM jurisdictions
        WHERE name='Bay Area'`
      )
    )[0]
    const countyArr = ["Contra Costa", "Marin", "Napa", "Santa Clara", "Solano", "Sonoma"]
    countyArr.forEach(async (county) => {
      const newJuris = { ...baseJurisdiction, name: county }
      delete newJuris.id
      delete newJuris.created_at
      delete newJuris.updated_at
      const jurisKeys = Object.keys(newJuris).toString()
      const jurisValues = Object.values(newJuris)
      await queryRunner.query(
        `INSERT INTO jurisdictions (${jurisKeys}) 
        VALUES ($1, $2, $3,$4, $5, $6,$7, $8, $9, $10)`,
        jurisValues
      )
    })
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
