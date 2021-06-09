import { MigrationInterface, QueryRunner } from "typeorm"
import { ApplicationPreference } from "../applications/entities/application-preferences.entity"

export class updateExtraDataInApplicationPreferences1622194142757 implements MigrationInterface {
  name = "updateExtraDataInApplicationPreferences1622194142757"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const result: Array<{ id: string, preferences: Array<ApplicationPreference> }> = await queryRunner.query("SELECT id, preferences from applications")
    // NOTE: Find every option in preferences where extraData is
    //  either undefined or null and replace it with an empty array
    for (const item of result) {
      for (const preference of item.preferences) {
        if ('options' in preference) {
          for (const option of preference.options) {
            if (option.extraData === undefined || option.extraData === null) {
              option.extraData = []
            }
          }
        }
      }
      await queryRunner.query("UPDATE applications SET preferences = ($1) WHERE id = ($2)", [JSON.stringify(item.preferences), item.id])
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

  }

}
