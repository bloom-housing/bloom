import {MigrationInterface, QueryRunner} from "typeorm";

export class addUnitAmiChartOverrides1629902677445 implements MigrationInterface {
    name = 'addUnitAmiChartOverrides1629902677445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "unit_ami_chart_overrides" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "items" jsonb NOT NULL, CONSTRAINT "PK_839676df1bd1ac12ff09b9d920d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "units" ADD "ami_chart_override_id" uuid`);
        await queryRunner.query(`ALTER TABLE "units" ADD CONSTRAINT "UQ_4ca3d4c823e6bd5149ecaad363a" UNIQUE ("ami_chart_override_id")`);
        await queryRunner.query(`ALTER TABLE "units" ADD CONSTRAINT "FK_4ca3d4c823e6bd5149ecaad363a" FOREIGN KEY ("ami_chart_override_id") REFERENCES "unit_ami_chart_overrides"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_4ca3d4c823e6bd5149ecaad363a"`);
        await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "UQ_4ca3d4c823e6bd5149ecaad363a"`);
        await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "ami_chart_override_id"`);
        await queryRunner.query(`DROP TABLE "unit_ami_chart_overrides"`);
    }

}
