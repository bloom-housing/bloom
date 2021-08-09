import {MigrationInterface, QueryRunner} from "typeorm";

export class unitsSummary1628022449780 implements MigrationInterface {
    name = 'unitsSummary1628022449780'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "units_summary" ("monthly_rent" character varying NOT NULL, "monthly_rent_as_percent_of_income" numeric(8,2), "ami_percentage" text, "minimum_income_min" text, "minimum_income_max" text, "max_occupancy" integer, "min_occupancy" integer, "floor_min" integer, "floor_max" integer, "sq_feet_min" numeric(8,2), "sq_feet_max" numeric(8,2), "total_count" integer, "total_available" integer, "unit_type_id" uuid NOT NULL, "property_id" uuid NOT NULL, "priority_type_id" uuid, CONSTRAINT "PK_dd5b004243c1536a412e425a9ec" PRIMARY KEY ("monthly_rent", "unit_type_id", "property_id"))`);
        await queryRunner.query(`ALTER TABLE "units_summary" ADD CONSTRAINT "FK_0eae6ec11a6109496d80d9a88f9" FOREIGN KEY ("unit_type_id") REFERENCES "unit_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "units_summary" ADD CONSTRAINT "FK_a2b6519fc3d102d4611a0e2b879" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "units_summary" ADD CONSTRAINT "FK_4791099ef82551aa9819a71d8f5" FOREIGN KEY ("priority_type_id") REFERENCES "unit_accessibility_priority_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "units_summary" DROP CONSTRAINT "FK_4791099ef82551aa9819a71d8f5"`);
        await queryRunner.query(`ALTER TABLE "units_summary" DROP CONSTRAINT "FK_a2b6519fc3d102d4611a0e2b879"`);
        await queryRunner.query(`ALTER TABLE "units_summary" DROP CONSTRAINT "FK_0eae6ec11a6109496d80d9a88f9"`);
        await queryRunner.query(`DROP TABLE "units_summary"`);
    }

}
