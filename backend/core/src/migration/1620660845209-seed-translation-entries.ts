import { MigrationInterface, QueryRunner } from "typeorm"
import { CountyCode } from "../shared/types/county-code"
import { Language } from "../shared/types/language-enum"

export class seedTranslationEntries1620660845209 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const countyCode in CountyCode) {
      for (const language in Language) {
        await queryRunner.query(
          `INSERT into "translation" (county_code, language, translations) VALUES ('${countyCode}', '${language}', '{}'::json)`
        )
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
