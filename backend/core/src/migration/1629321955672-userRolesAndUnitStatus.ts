import { MigrationInterface, QueryRunner } from "typeorm"

export class userRolesAndUnitStatus1629321955672 implements MigrationInterface {
  name = "userRolesAndUnitStatus1629321955672"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "status" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "status" SET DEFAULT 'unknown'`)
    await queryRunner.query(`ALTER TABLE "units_summary" DROP COLUMN "monthly_rent"`)
    await queryRunner.query(`ALTER TABLE "units_summary" ADD "monthly_rent" integer`)
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "UQ_87b8888186ca9769c960e926870" UNIQUE ("user_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "units_summary" ADD CONSTRAINT "FK_4edda29192dbc0c6a18e15437a0" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`
    )
    await queryRunner.query(
      `ALTER TABLE "units_summary" DROP CONSTRAINT "FK_4edda29192dbc0c6a18e15437a0"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "UQ_87b8888186ca9769c960e926870"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(`ALTER TABLE "units_summary" DROP COLUMN "monthly_rent"`)
    await queryRunner.query(`ALTER TABLE "units_summary" ADD "monthly_rent" character varying`)
    await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "status" DROP DEFAULT`)
    await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "status" DROP NOT NULL`)
  }
}
