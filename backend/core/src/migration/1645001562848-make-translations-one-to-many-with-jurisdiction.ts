import {MigrationInterface, QueryRunner} from "typeorm";

export class makeTranslationsOneToManyWithJurisdiction1645001562848 implements MigrationInterface {
    name = 'makeTranslationsOneToManyWithJurisdiction1645001562848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "translations" DROP CONSTRAINT "FK_181f8168d13457f0fd00b08b359"`);
        await queryRunner.query(`DROP INDEX "IDX_4655e7b2c26deb4b8156ea8100"`);
        await queryRunner.query(`ALTER TABLE "translations" DROP CONSTRAINT "UQ_181f8168d13457f0fd00b08b359"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4655e7b2c26deb4b8156ea8100" ON "translations" ("jurisdiction_id", "language") `);
        await queryRunner.query(`ALTER TABLE "translations" ADD CONSTRAINT "FK_181f8168d13457f0fd00b08b359" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "translations" DROP CONSTRAINT "FK_181f8168d13457f0fd00b08b359"`);
        await queryRunner.query(`DROP INDEX "IDX_4655e7b2c26deb4b8156ea8100"`);
        await queryRunner.query(`ALTER TABLE "translations" ADD CONSTRAINT "UQ_181f8168d13457f0fd00b08b359" UNIQUE ("jurisdiction_id")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4655e7b2c26deb4b8156ea8100" ON "translations" ("language", "jurisdiction_id") `);
        await queryRunner.query(`ALTER TABLE "translations" ADD CONSTRAINT "FK_181f8168d13457f0fd00b08b359" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
