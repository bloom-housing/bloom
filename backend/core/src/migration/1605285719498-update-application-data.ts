import {MigrationInterface, QueryRunner} from "typeorm";

export class updateApplicationData1605285719498 implements MigrationInterface {
    name = 'updateApplicationData1605285719498'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "other_type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "agency" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "demographics" DROP COLUMN "how_did_you_hear"`);
        await queryRunner.query(`ALTER TABLE "demographics" ADD "how_did_you_hear" text array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "demographics" DROP COLUMN "how_did_you_hear"`);
        await queryRunner.query(`ALTER TABLE "demographics" ADD "how_did_you_hear" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "agency" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "alternate_contact" ALTER COLUMN "other_type" SET NOT NULL`);
    }

}
