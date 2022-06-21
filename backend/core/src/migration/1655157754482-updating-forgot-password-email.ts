import { MigrationInterface, QueryRunner } from "typeorm"

export class updatingForgotPasswordEmail1655157754482 implements MigrationInterface {
  name = "updatingForgotPasswordEmail1655157754482"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ id }] = await queryRunner.query(`
        SELECT 
            t.id 
        FROM jurisdictions j 
            JOIN translations t ON t.jurisdiction_id = j.id
        WHERE name = 'Detroit'`)
    await queryRunner.query(`
        UPDATE translations
        SET translations = jsonb_set(translations, '{forgotPassword, resetRequest}', '"A request to reset your Detroit Home Connect website password for %{appUrl} has recently been made."')
        WHERE id = '${id}'
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
