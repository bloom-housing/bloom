import { MigrationInterface, QueryRunner } from "typeorm"

export class updateTranslations1658246384901 implements MigrationInterface {
  name = "updateTranslations1658246384901"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE translations 
        SET translations = jsonb_set(translations, '{invite, userUpdate}', '"Update to Your Partners Portal Account"') 
        WHERE language = 'en';
        
        UPDATE translations 
        SET translations = jsonb_set(translations, '{invite, userUpdateNewListings}', '"You have been added to new listings on Partners Portal. Click below to see:"') 
        WHERE language = 'en';
        
        UPDATE translations 
        SET translations = jsonb_set(translations, '{invite, portalAccountUpdate}', '"Update to Your Partners Portal Account"') 
        WHERE language = 'en';
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
