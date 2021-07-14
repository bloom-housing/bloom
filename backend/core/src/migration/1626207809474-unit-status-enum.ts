import {MigrationInterface, QueryRunner} from "typeorm";

export class unitStatusEnum1626207809474 implements MigrationInterface {
    name = 'unitStatusEnum1626207809474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "units_status_enum" AS ENUM('unknown', 'available', 'occupied')`);
        await queryRunner.query(`ALTER TABLE "units" ADD "status" "units_status_enum" NOT NULL DEFAULT 'unknown'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "units_status_enum"`);
        await queryRunner.query(`ALTER TABLE "units" ADD "status" text`);
    }

}
