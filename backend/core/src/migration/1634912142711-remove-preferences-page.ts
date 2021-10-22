import {MigrationInterface, QueryRunner} from "typeorm";

export class removePreferencesPage1634912142711 implements MigrationInterface {
    name = 'removePreferencesPage1634912142711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listing_preferences" DROP COLUMN "page"`);
        await queryRunner.query(`ALTER TABLE "preferences" DROP COLUMN "page"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "preferences" ADD "page" integer`);
        await queryRunner.query(`ALTER TABLE "listing_preferences" ADD "page" integer`);
    }

}
