import { MigrationInterface, QueryRunner } from "typeorm";

export class listingOpportunityTranslatedButtons1706548936939 implements MigrationInterface {
    name = 'listingOpportunityTranslatedButtons1706548936939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const translations = await queryRunner.query(`
          SELECT
              id,
              translations
          FROM translations
          WHERE language = 'en'
        `)
        translations.forEach(async (translation) => {
            let data = translation.translations
            data.rentalOpportunity = {
                ...data.rentalOpportunity,
                viewButton: {
                    en: "View listing & apply",
                    es: "Ver listado y aplicar",
                    zh: "查看列表并申请",
                    vi: "Xem danh sách và áp dụng",
                    tl: "Tingnan ang listahan at mag-apply"
                },
            }
            data = JSON.stringify(data)
            await queryRunner.query(`
          UPDATE translations
          SET translations = '${data.replace(/'/g, "''")}'
          WHERE id = '${translation.id}'
      `)
        })
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const translations = await queryRunner.query(`
      SELECT
          id,
          translations
      FROM translations
      WHERE language = 'en'
    `)
        translations.forEach(async (translation) => {
            let data = translation.translations
            if (data.rentalOpportunity && data.rentalOpportunity.viewButton) {
                delete data.rentalOpportunity.viewButton
            }
            data = JSON.stringify(data)
            await queryRunner.query(`
      UPDATE translations
      SET translations = '${data.replace(/'/g, "''")}'
      WHERE id = '${translation.id}'
  `)
        })
    }
}
