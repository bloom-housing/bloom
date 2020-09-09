import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1599658633406 implements MigrationInterface {
    name = 'initial1599658633406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "monthly_income_min"`);
        await queryRunner.query(`ALTER TABLE "units" ADD "monthly_income_min" numeric`);
        await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "monthly_rent"`);
        await queryRunner.query(`ALTER TABLE "units" ADD "monthly_rent" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "monthly_rent"`);
        await queryRunner.query(`ALTER TABLE "units" ADD "monthly_rent" text`);
        await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "monthly_income_min"`);
        await queryRunner.query(`ALTER TABLE "units" ADD "monthly_income_min" text`);
    }

}
