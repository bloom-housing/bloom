import {MigrationInterface, QueryRunner} from "typeorm";

export class addJurisdictionalProgramEntity1633948803537 implements MigrationInterface {
    name = 'addJurisdictionalProgramEntity1633948803537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "listing_programs" ("ordinal" integer, "page" integer, "listing_id" uuid NOT NULL, "program_id" uuid NOT NULL, CONSTRAINT "PK_84171c3ea1066baeed32822b139" PRIMARY KEY ("listing_id", "program_id"))`);
        await queryRunner.query(`CREATE TABLE "programs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "question" text, "description" text, "subtitle" text, "subdescription" text, CONSTRAINT "PK_d43c664bcaafc0e8a06dfd34e05" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "jurisdictions_programs_programs" ("jurisdictions_id" uuid NOT NULL, "programs_id" uuid NOT NULL, CONSTRAINT "PK_5e2009964fd0aab1366091610d3" PRIMARY KEY ("jurisdictions_id", "programs_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1ec5e2b056309e1248fb43bb08" ON "jurisdictions_programs_programs" ("jurisdictions_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_cc8517c9311a8e8a4bbabac30f" ON "jurisdictions_programs_programs" ("programs_id") `);
        await queryRunner.query(`ALTER TABLE "listing_programs" ADD CONSTRAINT "FK_89b3daa7bbc2dbd95f2760958c2" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listing_programs" ADD CONSTRAINT "FK_0fc46ddd2b9468b011d567740b5" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jurisdictions_programs_programs" ADD CONSTRAINT "FK_1ec5e2b056309e1248fb43bb08b" FOREIGN KEY ("jurisdictions_id") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "jurisdictions_programs_programs" ADD CONSTRAINT "FK_cc8517c9311a8e8a4bbabac30f3" FOREIGN KEY ("programs_id") REFERENCES "programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jurisdictions_programs_programs" DROP CONSTRAINT "FK_cc8517c9311a8e8a4bbabac30f3"`);
        await queryRunner.query(`ALTER TABLE "jurisdictions_programs_programs" DROP CONSTRAINT "FK_1ec5e2b056309e1248fb43bb08b"`);
        await queryRunner.query(`ALTER TABLE "listing_programs" DROP CONSTRAINT "FK_0fc46ddd2b9468b011d567740b5"`);
        await queryRunner.query(`ALTER TABLE "listing_programs" DROP CONSTRAINT "FK_89b3daa7bbc2dbd95f2760958c2"`);
        await queryRunner.query(`DROP INDEX "IDX_cc8517c9311a8e8a4bbabac30f"`);
        await queryRunner.query(`DROP INDEX "IDX_1ec5e2b056309e1248fb43bb08"`);
        await queryRunner.query(`DROP TABLE "jurisdictions_programs_programs"`);
        await queryRunner.query(`DROP TABLE "programs"`);
        await queryRunner.query(`DROP TABLE "listing_programs"`);
    }

}
