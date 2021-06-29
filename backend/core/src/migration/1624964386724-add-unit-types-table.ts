import { MigrationInterface, QueryRunner } from "typeorm"

export class addUnitTypesTable1624964386724 implements MigrationInterface {
  name = "addUnitTypesTable1624964386724"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "unit_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "PK_105c42fcf447c1da21fd20bcb85" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "units" ADD "unit_type_ref_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_ff39827140030e5b2ade0909d29" FOREIGN KEY ("unit_type_ref_id") REFERENCES "unit_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    for (const unitType of ["studio", "oneBdrm", "twoBdrm", "threeBdrm", "fourBdrm"]) {
      await queryRunner.query(`INSERT INTO "unit_types" (name) VALUES ($1)`, [unitType])
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_ff39827140030e5b2ade0909d29"`)
    await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "unit_type_ref_id"`)
    await queryRunner.query(`DROP TABLE "unit_types"`)
  }
}
