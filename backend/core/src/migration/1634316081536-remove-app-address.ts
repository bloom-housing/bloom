import {MigrationInterface, QueryRunner} from "typeorm";

export class removeAppAddress1634316081536 implements MigrationInterface {
    name = 'removeAppAddress1634316081536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_42385e47be1780d1491f0c8c1c3"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_address_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" ADD "application_address_id" uuid`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_42385e47be1780d1491f0c8c1c3" FOREIGN KEY ("application_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
