import { MigrationInterface, QueryRunner } from "typeorm"

export class addListingLeasingAgent1610715331956 implements MigrationInterface {
  name = "addListingLeasingAgent1610715331956"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "listings_leasing_agents_user_accounts" ("listings_id" uuid NOT NULL, "user_accounts_id" uuid NOT NULL, CONSTRAINT "PK_6c10161c8ebb6e0291145688c56" PRIMARY KEY ("listings_id", "user_accounts_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_f7b22af2c421e823f60c5f7d28" ON "listings_leasing_agents_user_accounts" ("listings_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_de53131bc8a08f824a5d3dd51e" ON "listings_leasing_agents_user_accounts" ("user_accounts_id") `
    )
    await queryRunner.query(`ALTER TABLE "user_accounts" ADD "address_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD CONSTRAINT "UQ_a72c6ee9575828fce562bd20a63" UNIQUE ("address_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD CONSTRAINT "FK_a72c6ee9575828fce562bd20a63" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listings_leasing_agents_user_accounts" ADD CONSTRAINT "FK_f7b22af2c421e823f60c5f7d28b" FOREIGN KEY ("listings_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listings_leasing_agents_user_accounts" ADD CONSTRAINT "FK_de53131bc8a08f824a5d3dd51e3" FOREIGN KEY ("user_accounts_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings_leasing_agents_user_accounts" DROP CONSTRAINT "FK_de53131bc8a08f824a5d3dd51e3"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings_leasing_agents_user_accounts" DROP CONSTRAINT "FK_f7b22af2c421e823f60c5f7d28b"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_accounts" DROP CONSTRAINT "FK_a72c6ee9575828fce562bd20a63"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_accounts" DROP CONSTRAINT "UQ_a72c6ee9575828fce562bd20a63"`
    )
    await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "address_id"`)
    await queryRunner.query(`DROP INDEX "IDX_de53131bc8a08f824a5d3dd51e"`)
    await queryRunner.query(`DROP INDEX "IDX_f7b22af2c421e823f60c5f7d28"`)
    await queryRunner.query(`DROP TABLE "listings_leasing_agents_user_accounts"`)
  }
}
