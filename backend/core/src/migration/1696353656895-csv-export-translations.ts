import { MigrationInterface, QueryRunner } from "typeorm"

export class csvExportTranslations1696353656895 implements MigrationInterface {
  name = "csvExportTranslations1696353656895"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const translations: { id: string; translations: any }[] = await queryRunner.query(`
        SELECT
            id,
            translations
        FROM translations
        WHERE language = 'en'
    `)
    translations.forEach(async (translation) => {
      let data = translation.translations
      data.csvExport = {
        title: "%{listingName} applications export",
        body: "The attached file is an applications export for %{listingName}. If you have any questions, please reach out to your administrator.",
        hello: "Hello,",
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
    // no down migration
  }
}
