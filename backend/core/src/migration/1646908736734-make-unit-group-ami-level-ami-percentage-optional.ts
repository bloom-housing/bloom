import {MigrationInterface, QueryRunner} from "typeorm";

export class makeUnitGroupAmiLevelAmiPercentageOptional1646908736734 implements MigrationInterface {
    name = 'makeUnitGroupAmiLevelAmiPercentageOptional1646908736734'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "unit_group_ami_levels" ALTER COLUMN "ami_percentage" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "unit_group_ami_levels" ALTER COLUMN "ami_percentage" SET NOT NULL`);
    }

}
