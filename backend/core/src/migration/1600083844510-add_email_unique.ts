import {MigrationInterface, QueryRunner} from "typeorm";

export class addEmailUnique1600083844510 implements MigrationInterface {
    name = 'addEmailUnique1600083844510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_accounts" ADD CONSTRAINT "UQ_df3802ec9c31dd9491e3589378d" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_accounts" DROP CONSTRAINT "UQ_df3802ec9c31dd9491e3589378d"`);
    }

}
