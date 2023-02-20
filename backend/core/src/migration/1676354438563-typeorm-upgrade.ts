import { MigrationInterface, QueryRunner } from "typeorm";

export class typeormUpgrade1676354438563 implements MigrationInterface {
    name = 'typeormUpgrade1676354438563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "FK_92adcb35f2f14e316b4cb12a84e"`);
        await queryRunner.query(`ALTER TABLE "listing_multiselect_questions" ALTER COLUMN "multiselect_question_id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "afs_last_run_at" SET DEFAULT '1970-01-01'`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "last_application_update_at" SET DEFAULT '1970-01-01'`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "UQ_87b8888186ca9769c960e926870" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "FK_92adcb35f2f14e316b4cb12a84e" FOREIGN KEY ("multiselect_question_id") REFERENCES "multiselect_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "FK_92adcb35f2f14e316b4cb12a84e"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "UQ_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "last_application_update_at" SET DEFAULT '1970-01-01 00:00:00-07'`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "afs_last_run_at" SET DEFAULT '1970-01-01 00:00:00-07'`);
        await queryRunner.query(`ALTER TABLE "listing_multiselect_questions" ALTER COLUMN "multiselect_question_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "FK_92adcb35f2f14e316b4cb12a84e" FOREIGN KEY ("multiselect_question_id") REFERENCES "multiselect_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
