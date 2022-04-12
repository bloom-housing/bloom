import {MigrationInterface, QueryRunner} from "typeorm";

export class detroitEmailUpdates1649709708991 implements MigrationInterface {
    name = 'detroitEmailUpdates1649709708991'

    public async up(queryRunner: QueryRunner): Promise<void> {
        let jurisdiction = await queryRunner.query("SELECT id FROM jurisdictions WHERE name = 'Detroit'")
        jurisdiction = jurisdiction[0].id
        const translation = await queryRunner.query(`SELECT id, translations FROM translations WHERE language='en' AND jurisdiction_id = '${jurisdiction}'`)
        const { id, translations } = translation[0]
        translations.footer.footer = "City of Detroit Housing and Revitalization Department"
        translations.footer.thankYou = "Thank you,"
        translations.register.welcomeMessage = "Thank you for setting up your account on %{appUrl}. It will now be easier to save listings that you are interested in on the site."
        await queryRunner.query(`UPDATE translations SET translations = ($1) WHERE id = ($2)`, [ translations, id ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
