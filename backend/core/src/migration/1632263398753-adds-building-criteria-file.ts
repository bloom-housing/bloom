import {MigrationInterface, QueryRunner} from "typeorm";

export class addsBuildingCriteriaFile1632263398753 implements MigrationInterface {
    name = 'addsBuildingCriteriaFile1632263398753'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" ADD "building_selection_criteria_file_id" uuid`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_2634b9bcb29ec36a629d9e379f0" FOREIGN KEY ("building_selection_criteria_file_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_2634b9bcb29ec36a629d9e379f0"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "building_selection_criteria_file_id"`);
    }

}
