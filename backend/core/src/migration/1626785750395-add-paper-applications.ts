import {MigrationInterface, QueryRunner} from "typeorm";

export class addPaperApplications1626785750395 implements MigrationInterface {
    name = 'addPaperApplications1626785750395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "application_methods" DROP CONSTRAINT "FK_b629c3b2549f33a911bcc84b65b"`);
        await queryRunner.query(`ALTER TABLE "application_methods" RENAME COLUMN "file_id" TO "phone_number"`);
        await queryRunner.query(`CREATE TABLE "paper_applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "language" character varying NOT NULL, "file_id" uuid, "application_method_id" uuid, CONSTRAINT "PK_1bc5b0234d874ec03f500621d43" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "application_methods" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "application_methods" ADD "phone_number" text`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "paper_applications" ADD CONSTRAINT "FK_493291d04c708dda2ffe5b521e7" FOREIGN KEY ("file_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "paper_applications" ADD CONSTRAINT "FK_bd67da96ae3e2c0e37394ba1dd3" FOREIGN KEY ("application_method_id") REFERENCES "application_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "paper_applications" DROP CONSTRAINT "FK_bd67da96ae3e2c0e37394ba1dd3"`);
        await queryRunner.query(`ALTER TABLE "paper_applications" DROP CONSTRAINT "FK_493291d04c708dda2ffe5b521e7"`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "application_methods" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "application_methods" ADD "phone_number" uuid`);
        await queryRunner.query(`DROP TABLE "paper_applications"`);
        await queryRunner.query(`ALTER TABLE "application_methods" RENAME COLUMN "phone_number" TO "file_id"`);
        await queryRunner.query(`ALTER TABLE "application_methods" ADD CONSTRAINT "FK_b629c3b2549f33a911bcc84b65b" FOREIGN KEY ("file_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
