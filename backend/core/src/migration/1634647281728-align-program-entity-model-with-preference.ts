import {MigrationInterface, QueryRunner} from "typeorm";

export class alignProgramEntityModelWithPreference1634647281728 implements MigrationInterface {
    name = 'alignProgramEntityModelWithPreference1634647281728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "programs" DROP COLUMN "question"`);
        await queryRunner.query(`ALTER TABLE "programs" DROP COLUMN "subdescription"`);
        await queryRunner.query(`ALTER TABLE "programs" ADD "title" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "programs" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "programs" ADD "subdescription" text`);
        await queryRunner.query(`ALTER TABLE "programs" ADD "question" text`);
    }

}
