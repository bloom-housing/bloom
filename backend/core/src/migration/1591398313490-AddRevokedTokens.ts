import { MigrationInterface, QueryRunner } from "typeorm"

export class AddRevokedTokens1591398313490 implements MigrationInterface {
  name = "AddRevokedTokens1591398313490"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "revoked_token" ("token" character varying NOT NULL, "revoked_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_572b4c3824a800e4341ee43fcee" PRIMARY KEY ("token"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "revoked_token"`)
  }
}
