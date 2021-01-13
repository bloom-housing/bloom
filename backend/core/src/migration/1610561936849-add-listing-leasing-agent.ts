import {MigrationInterface, QueryRunner} from "typeorm";

export class addListingLeasingAgent1610561936849 implements MigrationInterface {
    name = 'addListingLeasingAgent1610561936849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_accounts" ADD "is_leasing_agent" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user_accounts" ADD "address_id" uuid`);
        await queryRunner.query(`ALTER TABLE "user_accounts" ADD CONSTRAINT "UQ_a72c6ee9575828fce562bd20a63" UNIQUE ("address_id")`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "leasing_agent_id" uuid`);
        await queryRunner.query(`ALTER TABLE "user_accounts" ADD CONSTRAINT "FK_a72c6ee9575828fce562bd20a63" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_ac0c4e2fc8d8a487d09730ae8d9" FOREIGN KEY ("leasing_agent_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_ac0c4e2fc8d8a487d09730ae8d9"`);
        await queryRunner.query(`ALTER TABLE "user_accounts" DROP CONSTRAINT "FK_a72c6ee9575828fce562bd20a63"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "leasing_agent_id"`);
        await queryRunner.query(`ALTER TABLE "user_accounts" DROP CONSTRAINT "UQ_a72c6ee9575828fce562bd20a63"`);
        await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "address_id"`);
        await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "is_leasing_agent"`);
    }

}
