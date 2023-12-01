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
    //add new jurisdictions
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
        VALUES (${jurisValues.map((_, index) => `$${index + 1}`).toString()})`,
        jurisValues
      )
    })

    //link existing listings to corresponding jurisdiction
    const existingListings = await queryRunner.query(
      `SELECT listings.id,county
       FROM listings 
       LEFT JOIN address on listings.building_address_id = address.id`
    )
    const existingJurisdictions = await queryRunner.query(
      `SELECT id,name
       FROM jurisdictions`
    )

    existingListings.forEach(async (listing) => {
      const matchingJuris = existingJurisdictions.find((juris) => juris.name === listing.county)
      if (matchingJuris) {
        await queryRunner.query(
          `UPDATE listings
          SET jurisdiction_id='${matchingJuris.id}'
          WHERE id='${listing.id}'`
        )
      }
    })

    const existingUsersAndRoles = await queryRunner.query(
      `SELECT user_id,is_admin,is_jurisdictional_admin,is_partner
      FROM user_roles`
    )

    // Update user information
    existingUsersAndRoles.forEach(async (user) => {
      // Add all jurisdictions to the admin users
      if (user.is_admin) {
        existingJurisdictions.forEach(async (jurisdiction) => {
          if (jurisdiction.name !== "Bay Area") {
            await queryRunner.query(
              `INSERT INTO user_accounts_jurisdictions_jurisdictions
              (user_accounts_id, jurisdictions_id)
              VALUES ($1, $2)`,
              [user.user_id, jurisdiction.id]
            )
          }
        })
        // Add all jurisdictions tied to listings of partner accounts
      } else if (user.is_partner) {
        const userListings = await queryRunner.query(
          `SELECT listings_id from listings_leasing_agents_user_accounts where user_accounts_id = '${user.user_id}'`
        )
        userListings.forEach(async (listing) => {
          const matchingListing = existingListings.find((list) => list.id === listing.listings_id)
          const matchingJuris = existingJurisdictions.find(
            (juris) => juris.name === matchingListing.county
          )
          if (matchingJuris) {
            await queryRunner.query(
              `INSERT INTO user_accounts_jurisdictions_jurisdictions
              (user_accounts_id, jurisdictions_id)
              VALUES ($1, $2)
              ON CONFLICT (user_accounts_id, jurisdictions_id) DO NOTHING
              `,
              [user.user_id, matchingJuris.id]
            )
          }
        })
      }
    })

    //link existing ami charts to new jurisdictions
    const amiJurisMap = {
      "Marin - HUD": "Marin",
      "Napa - HUD": "Napa",
      "Contra Costa - HUD": "Contra Costa",
      "Santa Clara - HUD": "Santa Clara",
      "Solano - HUD": "Solano",
      "Sonoma - HUD": "Sonoma",
      "Sonoma - Sonoma County State and Local": "Sonoma",
      "Contra Costa - CA TCAC": "Contra Costa",
      "Marin - CA TCAC": "Marin",
      "Napa - CA TCAC": "Napa",
      "Santa Clara - CA TCAC": "Santa Clara",
      "Solano - CA TCAC": "Solano",
      "Sonoma - CA TCAC": "Sonoma",
    }
    const amiCharts = await queryRunner.query(
      `SELECT id,name
       FROM ami_chart`
    )
    amiCharts.forEach(async (ami) => {
      const matchingJuris = existingJurisdictions.find(
        (juris) => juris.name === amiJurisMap[ami.name]
      )?.id
      if (matchingJuris) {
        await queryRunner.query(
          `UPDATE ami_chart
          SET jurisdiction_id='${matchingJuris}'
          WHERE id='${ami.id}'`
        )
      }
    })
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
