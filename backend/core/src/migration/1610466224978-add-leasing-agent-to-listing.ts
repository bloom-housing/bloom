import {MigrationInterface, QueryRunner} from "typeorm";

export class addLeasingAgentToListing1610466224978 implements MigrationInterface {
    name = 'addLeasingAgentToListing1610466224978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_accounts" ADD "is_leasing_agent" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user_accounts" ADD "address" jsonb`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "leasing_agent_id" uuid`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_ac0c4e2fc8d8a487d09730ae8d9" FOREIGN KEY ("leasing_agent_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_ac0c4e2fc8d8a487d09730ae8d9"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "leasing_agent_id"`);
        await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "is_leasing_agent"`);
    }

}
