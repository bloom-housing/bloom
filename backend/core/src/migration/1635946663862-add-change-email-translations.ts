import { MigrationInterface, QueryRunner } from "typeorm"

export class addChangeEmailTranslations1635946663862 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const changeEmail = {
      message: "An email address change has been requested for your account.",
      onChangeEmailMessage: "To change your email address, please click the link below:",
      changeMyEmail: "Change my email",
    }
    const translations = await queryRunner.query(`SELECT * from translations`)
    for (const t of translations) {
      await queryRunner.query(`UPDATE translations SET translations = ($1) WHERE id = ($2)`, [
        { ...t.translations, changeEmail },
        t.id,
      ])
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
