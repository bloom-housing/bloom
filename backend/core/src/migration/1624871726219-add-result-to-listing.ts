import { MigrationInterface, QueryRunner } from "typeorm"

export class addResultToListing1624871726219 implements MigrationInterface {
  name = "addResultToListing1624871726219"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" ADD "result_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_3f7b2aedbfccd6297923943e311" FOREIGN KEY ("result_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_3f7b2aedbfccd6297923943e311"`
    )
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "result_id"`)
  }
}
