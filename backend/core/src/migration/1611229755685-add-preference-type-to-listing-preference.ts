import {MigrationInterface, QueryRunner} from "typeorm";

export class addPreferenceTypeToListingPreference1611229755685 implements MigrationInterface {
    name = 'addPreferenceTypeToListingPreference1611229755685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "preferences_type_enum" AS ENUM('base', 'liveOrWork', 'displaced')`);
        await queryRunner.query(`ALTER TABLE "preferences" ADD "type" "preferences_type_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "preferences" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "preferences_type_enum"`);
    }

}
