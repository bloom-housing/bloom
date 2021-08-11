import {MigrationInterface, QueryRunner} from "typeorm";

export class listingsUnitsSummary1628714025901 implements MigrationInterface {
    name = 'listingsUnitsSummary1628714025901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "units_summary" DROP CONSTRAINT "FK_a2b6519fc3d102d4611a0e2b879"`);
        await queryRunner.query(`ALTER TABLE "units_summary" RENAME COLUMN "property_id" TO "listing_id"`);
        await queryRunner.query(`ALTER TABLE "units_summary" RENAME CONSTRAINT "PK_dd5b004243c1536a412e425a9ec" TO "PK_0ea6bb34382cb45f6b3280f50f2"`);
        await queryRunner.query(`ALTER TABLE "units_summary" ADD CONSTRAINT "FK_4edda29192dbc0c6a18e15437a0" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "units_summary" DROP CONSTRAINT "FK_4edda29192dbc0c6a18e15437a0"`);
        await queryRunner.query(`ALTER TABLE "units_summary" RENAME CONSTRAINT "PK_0ea6bb34382cb45f6b3280f50f2" TO "PK_dd5b004243c1536a412e425a9ec"`);
        await queryRunner.query(`ALTER TABLE "units_summary" RENAME COLUMN "listing_id" TO "property_id"`);
        await queryRunner.query(`ALTER TABLE "units_summary" ADD CONSTRAINT "FK_a2b6519fc3d102d4611a0e2b879" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
