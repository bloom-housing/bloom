import {MigrationInterface, QueryRunner} from "typeorm";

export class addListingAmiChartOverrides1627462124890 implements MigrationInterface {
    name = 'addListingAmiChartOverrides1627462124890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "listing_ami_chart_overrides" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "items" jsonb NOT NULL, "unit_id" uuid, "listing_id" uuid, CONSTRAINT "PK_4f631462b762a2ff5f3f65d4eee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "listing_ami_chart_overrides" ADD CONSTRAINT "FK_be869ac62d962d65714845edb9e" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listing_ami_chart_overrides" ADD CONSTRAINT "FK_621db0b47f3498de46f406e89d6" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listing_ami_chart_overrides" DROP CONSTRAINT "FK_621db0b47f3498de46f406e89d6"`);
        await queryRunner.query(`ALTER TABLE "listing_ami_chart_overrides" DROP CONSTRAINT "FK_be869ac62d962d65714845edb9e"`);
        await queryRunner.query(`DROP TABLE "listing_ami_chart_overrides"`);
    }

}
