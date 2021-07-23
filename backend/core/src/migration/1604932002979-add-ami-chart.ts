import { MigrationInterface, QueryRunner } from "typeorm"

export class addAmiChart1604932002979 implements MigrationInterface {
  name = "addAmiChart1604932002979"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ami_chart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_e079bbfad233fdc79072acb33b5" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "ami_chart_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "percent_of_ami" integer NOT NULL, "household_size" integer NOT NULL, "income" integer NOT NULL, "ami_chart_id" uuid, CONSTRAINT "PK_50c1f3d69f4675d775e08d7465e" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP COLUMN "blank_paper_application_can_be_picked_up"`
    )
    await queryRunner.query(`ALTER TABLE "property" ADD "ami_chart_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "property" ADD CONSTRAINT "FK_d639fcd25af4127bc979d5146a9" FOREIGN KEY ("ami_chart_id") REFERENCES "ami_chart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "ami_chart_item" ADD CONSTRAINT "FK_98d10c0d335d9e4aca6fb5335b3" FOREIGN KEY ("ami_chart_id") REFERENCES "ami_chart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ami_chart_item" DROP CONSTRAINT "FK_98d10c0d335d9e4aca6fb5335b3"`
    )
    await queryRunner.query(
      `ALTER TABLE "property" DROP CONSTRAINT "FK_d639fcd25af4127bc979d5146a9"`
    )
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "ami_chart_id"`)
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "blank_paper_application_can_be_picked_up" boolean`
    )
    await queryRunner.query(`DROP TABLE "ami_chart_item"`)
    await queryRunner.query(`DROP TABLE "ami_chart"`)
  }
}
