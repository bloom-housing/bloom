import {MigrationInterface, QueryRunner} from "typeorm";

export class addAssetsTable1623247120126 implements MigrationInterface {
    name = 'addAssetsTable1623247120126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "FK_8cb54e950245d30651b903a4c61"`);
        await queryRunner.query(`DROP INDEX "IDX_ada354174d7f8a8f3d56c39bba"`);
        await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "listing_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" ADD "listing_id" uuid`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ada354174d7f8a8f3d56c39bba" ON "translations" ("county_code", "language") `);
        await queryRunner.query(`ALTER TABLE "assets" ADD CONSTRAINT "FK_8cb54e950245d30651b903a4c61" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
