import {MigrationInterface, QueryRunner} from "typeorm";
import { CountyCode } from "../shared/types/county-code"

export class addJurisdictionsTable1624272587523 implements MigrationInterface {
    name = 'addJurisdictionsTable1624272587523'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "jurisdictions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "PK_7cc0bed21c9e2b32866c1109ec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "jurisdiction_id" uuid`);
        await queryRunner.query(`ALTER TABLE "preferences" ALTER COLUMN "page" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "preferences"."page" IS NULL`);
        await queryRunner.query(`ALTER TABLE "preferences" ALTER COLUMN "page" DROP DEFAULT`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8317da96d5a775889e2631cc25" ON "translations" ("county_code", "language") `);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_ba0026e02ecfe91791aed1a4818" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        for(const jurisdictionName of [CountyCode.alameda, CountyCode.san_jose, CountyCode.san_mateo]) {
            const jurisdiction = await queryRunner.query(`INSERT INTO "jurisdictions" (name) VALUES ($1)`, [jurisdictionName]);
            const listingsMatchingJurisdiction = await queryRunner.query(`SELECT id from listings where county_code = ($1)`, [jurisdictionName])
            for (const listing of listingsMatchingJurisdiction) {
              await queryRunner.query(`UPDATE listings SET jurisdiction_id = ($1) WHERE id = ($2)`, [jurisdiction.id, listing.id])
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_ba0026e02ecfe91791aed1a4818"`);
        await queryRunner.query(`DROP INDEX "IDX_8317da96d5a775889e2631cc25"`);
        await queryRunner.query(`ALTER TABLE "preferences" ALTER COLUMN "page" SET DEFAULT '1'`);
        await queryRunner.query(`COMMENT ON COLUMN "preferences"."page" IS NULL`);
        await queryRunner.query(`ALTER TABLE "preferences" ALTER COLUMN "page" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "jurisdiction_id"`);
        await queryRunner.query(`DROP TABLE "jurisdictions"`);
    }

}
