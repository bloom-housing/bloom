import {MigrationInterface, QueryRunner} from "typeorm";

export class addsJurisdictionsTranslations1629744413542 implements MigrationInterface {
    name = 'addsJurisdictionsTranslations1629744413542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_8317da96d5a775889e2631cc25"`);
        // get translation county codes before rename
        const translations = await queryRunner.query(`SELECT id, county_code FROM translations`)
        await queryRunner.query(`ALTER TABLE "translations" RENAME COLUMN "county_code" TO "jurisdiction_id"`);
        await queryRunner.query(`ALTER TABLE "jurisdictions" ADD CONSTRAINT "UQ_60b3294568b273d896687dea59f" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "translations" DROP COLUMN "jurisdiction_id"`);
        await queryRunner.query(`ALTER TABLE "translations" ADD "jurisdiction_id" uuid`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4655e7b2c26deb4b8156ea8100" ON "translations" ("jurisdiction_id", "language") `);
        await queryRunner.query(`ALTER TABLE "translations" ADD CONSTRAINT "FK_181f8168d13457f0fd00b08b359" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // set jurisdiction id from old county code
        for (const translation of translations) {
            await queryRunner.query(`
                UPDATE translations
                SET jurisdiction_id = j.id
                FROM translations AS t
                    INNER JOIN jurisdictions AS j
                    ON '${translation.county_code}' = j.name
                WHERE t.id = '${translation.id}'
                
            `)
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "translations" DROP CONSTRAINT "FK_181f8168d13457f0fd00b08b359"`);
        await queryRunner.query(`DROP INDEX "IDX_4655e7b2c26deb4b8156ea8100"`);
        await queryRunner.query(`ALTER TABLE "translations" DROP COLUMN "jurisdiction_id"`);
        await queryRunner.query(`ALTER TABLE "translations" ADD "jurisdiction_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jurisdictions" DROP CONSTRAINT "UQ_60b3294568b273d896687dea59f"`);
        await queryRunner.query(`ALTER TABLE "translations" RENAME COLUMN "jurisdiction_id" TO "county_code"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8317da96d5a775889e2631cc25" ON "translations" ("county_code", "language") `);
    }

}
