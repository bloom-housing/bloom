import { MigrationInterface, QueryRunner } from "typeorm"

export class catchUp1646872355286 implements MigrationInterface {
  name = "catchUp1646872355286"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "unit_group_ami_levels" DROP CONSTRAINT "FK_c15eff18d0384540366861a1c9c"`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_ami_levels" DROP CONSTRAINT "FK_859a749beeb93898cfe3aa318e7"`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group" DROP CONSTRAINT "FK_4edda29192dbc0c6a18e15437a0"`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group" DROP CONSTRAINT "FK_4791099ef82551aa9819a71d8f5"`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_unit_type_unit_types" DROP CONSTRAINT "FK_b905b8bda3171b06c7a5d4d6712"`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_unit_type_unit_types" DROP CONSTRAINT "FK_1951c380e8091486b9800088865"`
    )
    await queryRunner.query(`DROP INDEX "IDX_1951c380e8091486b980008886"`)
    await queryRunner.query(`DROP INDEX "IDX_b905b8bda3171b06c7a5d4d671"`)
    await queryRunner.query(
      `CREATE INDEX "IDX_1ea90313ee94f48800e9eef751" ON "unit_group_unit_type_unit_types" ("unit_group_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_0cf027359361dfd394f08686da" ON "unit_group_unit_type_unit_types" ("unit_types_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_ami_levels" ADD CONSTRAINT "FK_ff3f8de67facd164607f1ef43ae" FOREIGN KEY ("ami_chart_id") REFERENCES "ami_chart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_ami_levels" ADD CONSTRAINT "FK_ce82398e48c10dc23920c6ff05a" FOREIGN KEY ("unit_group_id") REFERENCES "unit_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group" ADD CONSTRAINT "FK_926790e4013043593a3976d84bd" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group" ADD CONSTRAINT "FK_e2660f5da2ff575954d765d920b" FOREIGN KEY ("priority_type_id") REFERENCES "unit_accessibility_priority_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_unit_type_unit_types" ADD CONSTRAINT "FK_1ea90313ee94f48800e9eef751e" FOREIGN KEY ("unit_group_id") REFERENCES "unit_group"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_unit_type_unit_types" ADD CONSTRAINT "FK_0cf027359361dfd394f08686da2" FOREIGN KEY ("unit_types_id") REFERENCES "unit_types"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "unit_group_unit_type_unit_types" DROP CONSTRAINT "FK_0cf027359361dfd394f08686da2"`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_unit_type_unit_types" DROP CONSTRAINT "FK_1ea90313ee94f48800e9eef751e"`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group" DROP CONSTRAINT "FK_e2660f5da2ff575954d765d920b"`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group" DROP CONSTRAINT "FK_926790e4013043593a3976d84bd"`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_ami_levels" DROP CONSTRAINT "FK_ce82398e48c10dc23920c6ff05a"`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_ami_levels" DROP CONSTRAINT "FK_ff3f8de67facd164607f1ef43ae"`
    )
    await queryRunner.query(`DROP INDEX "IDX_0cf027359361dfd394f08686da"`)
    await queryRunner.query(`DROP INDEX "IDX_1ea90313ee94f48800e9eef751"`)
    await queryRunner.query(
      `CREATE INDEX "IDX_b905b8bda3171b06c7a5d4d671" ON "unit_group_unit_type_unit_types" ("unit_types_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_1951c380e8091486b980008886" ON "unit_group_unit_type_unit_types" ("unit_group_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_unit_type_unit_types" ADD CONSTRAINT "FK_1951c380e8091486b9800088865" FOREIGN KEY ("unit_group_id") REFERENCES "unit_group"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_unit_type_unit_types" ADD CONSTRAINT "FK_b905b8bda3171b06c7a5d4d6712" FOREIGN KEY ("unit_types_id") REFERENCES "unit_types"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group" ADD CONSTRAINT "FK_4791099ef82551aa9819a71d8f5" FOREIGN KEY ("priority_type_id") REFERENCES "unit_accessibility_priority_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group" ADD CONSTRAINT "FK_4edda29192dbc0c6a18e15437a0" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_ami_levels" ADD CONSTRAINT "FK_859a749beeb93898cfe3aa318e7" FOREIGN KEY ("ami_chart_id") REFERENCES "ami_chart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "unit_group_ami_levels" ADD CONSTRAINT "FK_c15eff18d0384540366861a1c9c" FOREIGN KEY ("unit_group_id") REFERENCES "unit_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
