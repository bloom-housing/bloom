import {MigrationInterface, QueryRunner} from "typeorm";

export class removeAppDefaults1635126814120 implements MigrationInterface {
    name = 'removeAppDefaults1635126814120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "digital_application" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "digital_application" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "common_digital_application" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "common_digital_application" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "paper_application" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "paper_application" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "referral_opportunity" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "referral_opportunity" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "referral_opportunity" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "referral_opportunity" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "paper_application" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "paper_application" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "common_digital_application" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "common_digital_application" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "digital_application" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "digital_application" SET NOT NULL`);
    }

}
