import {MigrationInterface, QueryRunner} from "typeorm";

export class removeForeignKeyConstraints1644266198235 implements MigrationInterface {
    name = 'removeForeignKeyConstraints1644266198235'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_35571c6bd2a1ff690201d1dff08"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "units" ADD CONSTRAINT "FK_35571c6bd2a1ff690201d1dff08" FOREIGN KEY ("ami_chart_id") REFERENCES "ami_chart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
