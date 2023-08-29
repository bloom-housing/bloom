import { MigrationInterface, QueryRunner } from "typeorm"

export class ami120Updates1692890494691 implements MigrationInterface {
  name = "ami120Updates1692890494691"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const amiUpdates = [
      {
        name: "Contra Costa - CA TCAC",
        items: [
          { income: 124320, percentOfAmi: 120, householdSize: 1 },
          { income: 142080, percentOfAmi: 120, householdSize: 2 },
          { income: 159840, percentOfAmi: 120, householdSize: 3 },
          { income: 177480, percentOfAmi: 120, householdSize: 4 },
          { income: 191760, percentOfAmi: 120, householdSize: 5 },
          { income: 205920, percentOfAmi: 120, householdSize: 6 },
          { income: 220080, percentOfAmi: 120, householdSize: 7 },
          { income: 234360, percentOfAmi: 120, householdSize: 8 },
        ],
      },
      {
        name: "Marin - CA TCAC",
        items: [
          { income: 156120, percentOfAmi: 120, householdSize: 1 },
          { income: 178440, percentOfAmi: 120, householdSize: 2 },
          { income: 200760, percentOfAmi: 120, householdSize: 3 },
          { income: 222960, percentOfAmi: 120, householdSize: 4 },
          { income: 240840, percentOfAmi: 120, householdSize: 5 },
          { income: 258720, percentOfAmi: 120, householdSize: 6 },
          { income: 276480, percentOfAmi: 120, householdSize: 7 },
          { income: 294360, percentOfAmi: 120, householdSize: 8 },
        ],
      },
      {
        name: "Napa - CA TCAC",
        items: [
          { income: 112200, percentOfAmi: 120, householdSize: 1 },
          { income: 128160, percentOfAmi: 120, householdSize: 2 },
          { income: 144240, percentOfAmi: 120, householdSize: 3 },
          { income: 160200, percentOfAmi: 120, householdSize: 4 },
          { income: 173040, percentOfAmi: 120, householdSize: 5 },
          { income: 185880, percentOfAmi: 120, householdSize: 6 },
          { income: 198720, percentOfAmi: 120, householdSize: 7 },
          { income: 211560, percentOfAmi: 120, householdSize: 8 },
        ],
      },

      {
        name: "Santa Clara - CA TCAC",
        items: [
          { income: 149880, percentOfAmi: 120, householdSize: 1 },
          { income: 171360, percentOfAmi: 120, householdSize: 2 },
          { income: 192720, percentOfAmi: 120, householdSize: 3 },
          { income: 214080, percentOfAmi: 120, householdSize: 4 },
          { income: 231240, percentOfAmi: 120, householdSize: 5 },
          { income: 248400, percentOfAmi: 120, householdSize: 6 },
          { income: 265560, percentOfAmi: 120, householdSize: 7 },
          { income: 282600, percentOfAmi: 120, householdSize: 8 },
        ],
      },

      {
        name: "Solano - CA TCAC",
        items: [
          { income: 96120, percentOfAmi: 120, householdSize: 1 },
          { income: 109920, percentOfAmi: 120, householdSize: 2 },
          { income: 123600, percentOfAmi: 120, householdSize: 3 },
          { income: 137280, percentOfAmi: 120, householdSize: 4 },
          { income: 148320, percentOfAmi: 120, householdSize: 5 },
          { income: 159360, percentOfAmi: 120, householdSize: 6 },
          { income: 170280, percentOfAmi: 120, householdSize: 7 },
          { income: 181320, percentOfAmi: 120, householdSize: 8 },
        ],
      },

      {
        name: "Sonoma - CA TCAC",
        items: [
          { income: 105720, percentOfAmi: 120, householdSize: 1 },
          { income: 120840, percentOfAmi: 120, householdSize: 2 },
          { income: 135960, percentOfAmi: 120, householdSize: 3 },
          { income: 150960, percentOfAmi: 120, householdSize: 4 },
          { income: 163080, percentOfAmi: 120, householdSize: 5 },
          { income: 175200, percentOfAmi: 120, householdSize: 6 },
          { income: 187200, percentOfAmi: 120, householdSize: 7 },
          { income: 199320, percentOfAmi: 120, householdSize: 8 },
        ],
      },
    ]

    amiUpdates.forEach(async (amiUpdate) => {
      const currentItems = await queryRunner.query(
        `SELECT items 
        FROM ami_chart
        WHERE name='${amiUpdate.name}'`
      )
      if (currentItems[0]) {
        const combinedItems = [...currentItems[0].items, ...amiUpdate.items]
        await queryRunner.query(
          `UPDATE ami_chart 
        SET items='${JSON.stringify(combinedItems)}'
        WHERE name='${amiUpdate.name}'`
        )
      }
    })
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
