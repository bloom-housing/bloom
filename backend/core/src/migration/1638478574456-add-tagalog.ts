import {MigrationInterface, QueryRunner} from "typeorm";

export class addTagalog1638478574456 implements MigrationInterface {
    name = 'addTagalog1638478574456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "jurisdictions_languages_enum" RENAME TO "jurisdictions_languages_enum_old"`);
        await queryRunner.query(`CREATE TYPE "jurisdictions_languages_enum" AS ENUM('en', 'es', 'vi', 'zh', 'tl')`);
        await queryRunner.query(`ALTER TABLE "jurisdictions" ALTER COLUMN "languages" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "jurisdictions" ALTER COLUMN "languages" TYPE "jurisdictions_languages_enum"[] USING "languages"::"text"::"jurisdictions_languages_enum"[]`);
        await queryRunner.query(`ALTER TABLE "jurisdictions" ALTER COLUMN "languages" SET DEFAULT '{en}'`);
        await queryRunner.query(`DROP TYPE "jurisdictions_languages_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "jurisdictions_languages_enum_old" AS ENUM('en', 'es', 'vi', 'zh')`);
        await queryRunner.query(`ALTER TABLE "jurisdictions" ALTER COLUMN "languages" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "jurisdictions" ALTER COLUMN "languages" TYPE "jurisdictions_languages_enum_old"[] USING "languages"::"text"::"jurisdictions_languages_enum_old"[]`);
        await queryRunner.query(`ALTER TABLE "jurisdictions" ALTER COLUMN "languages" SET DEFAULT '{en}'`);
        await queryRunner.query(`DROP TYPE "jurisdictions_languages_enum"`);
        await queryRunner.query(`ALTER TYPE "jurisdictions_languages_enum_old" RENAME TO "jurisdictions_languages_enum"`);
    }

}
