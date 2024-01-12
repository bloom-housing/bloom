import { MigrationInterface, QueryRunner } from "typeorm"

export class addMapLayers1704908499461 implements MigrationInterface {
  name = "addMapLayers1704908499461"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "map_layers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "jurisdiction_id" character varying NOT NULL, CONSTRAINT "PK_d1bcb10041ba88ffea330dc10d9" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "map_layers"`)
  }
}
