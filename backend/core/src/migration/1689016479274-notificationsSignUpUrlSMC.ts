import { MigrationInterface, QueryRunner } from "typeorm"

export class notificationsSignUpUrlSMC1689016479274 implements MigrationInterface {
  name = "notificationsSignUpUrlSMC1689016479274"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE jurisdictions
        SET notifications_sign_up_url = 'https://public.govdelivery.com/accounts/CASMATEO/subscriber/new?topic_id=CASMATEO_358'
        WHERE name = 'San Mateo'
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE jurisdictions
        SET notifications_sign_up_url = null
        WHERE name = 'San Mateo'
    `)
  }
}
