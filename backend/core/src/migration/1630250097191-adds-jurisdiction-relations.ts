import { MigrationInterface, QueryRunner } from "typeorm"

export class addsJurisdictionRelations1630250097191 implements MigrationInterface {
  name = "addsJurisdictionRelations1630250097191"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_8317da96d5a775889e2631cc25"`)
    // get translation county codes before rename
    const translations = await queryRunner.query(`SELECT id, county_code FROM translations`)
    await queryRunner.query(
      `ALTER TABLE "translations" RENAME COLUMN "county_code" TO "jurisdiction_id"`
    )
    await queryRunner.query(
      `CREATE TABLE "user_accounts_jurisdictions_jurisdictions" ("user_accounts_id" uuid NOT NULL, "jurisdictions_id" uuid NOT NULL, CONSTRAINT "PK_66ae1ae446619b775cafb03ce4a" PRIMARY KEY ("user_accounts_id", "jurisdictions_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_e51e812700e143101aeaabbccc" ON "user_accounts_jurisdictions_jurisdictions" ("user_accounts_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_fe359f4430f9e0e7b278e03f0f" ON "user_accounts_jurisdictions_jurisdictions" ("jurisdictions_id") `
    )
    // assign jurisdiciton ID from county code
    await queryRunner.query(`
          UPDATE listings
          SET jurisdiction_id = j.id
          FROM listings AS l
            INNER JOIN jurisdictions AS j
              ON l.county_code = j.name
        `)
    // drops county code from listings
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "county_code"`)
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ADD CONSTRAINT "UQ_60b3294568b273d896687dea59f" UNIQUE ("name")`
    )
    await queryRunner.query(`ALTER TABLE "translations" DROP COLUMN "jurisdiction_id"`)
    await queryRunner.query(`ALTER TABLE "translations" ADD "jurisdiction_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "translations" ADD CONSTRAINT "UQ_181f8168d13457f0fd00b08b359" UNIQUE ("jurisdiction_id")`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4655e7b2c26deb4b8156ea8100" ON "translations" ("jurisdiction_id", "language") `
    )
    await queryRunner.query(
      `ALTER TABLE "translations" ADD CONSTRAINT "FK_181f8168d13457f0fd00b08b359" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_accounts_jurisdictions_jurisdictions" ADD CONSTRAINT "FK_e51e812700e143101aeaabbccc6" FOREIGN KEY ("user_accounts_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_accounts_jurisdictions_jurisdictions" ADD CONSTRAINT "FK_fe359f4430f9e0e7b278e03f0f3" FOREIGN KEY ("jurisdictions_id") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    // get first jurisdiction_id
    const [{ id }] = await queryRunner.query(`SELECT id FROM jurisdictions ORDER BY name LIMIT 1`)
    // insert into user_accounts_jurisdictions_jurisdictions
    // TODO: This works for Alameda, but if you have Alameda as a Jurisdiction and want to assign another, you'll want to change it, for example with Detroit, if Detroit isn't the only Jurisdiction in your DB.
    await queryRunner.query(
      `INSERT INTO user_accounts_jurisdictions_jurisdictions ("user_accounts_id", "jurisdictions_id")
            SELECT id, '${id}' FROM user_accounts`
    )

    // update translations - set jurisdiction id from old county code
    for (const translation of translations) {
      await queryRunner.query(`
              UPDATE translations
              SET jurisdiction_id = j.id
              FROM translations AS t
                  INNER JOIN jurisdictions AS j
                  ON '${translation.county_code}' = j.name
              WHERE t.id = '${translation.id}'
              
          `)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_accounts_jurisdictions_jurisdictions" DROP CONSTRAINT "FK_fe359f4430f9e0e7b278e03f0f3"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_accounts_jurisdictions_jurisdictions" DROP CONSTRAINT "FK_e51e812700e143101aeaabbccc6"`
    )
    await queryRunner.query(
      `ALTER TABLE "translations" DROP CONSTRAINT "FK_181f8168d13457f0fd00b08b359"`
    )
    await queryRunner.query(`DROP INDEX "IDX_4655e7b2c26deb4b8156ea8100"`)
    await queryRunner.query(
      `ALTER TABLE "translations" DROP CONSTRAINT "UQ_181f8168d13457f0fd00b08b359"`
    )
    await queryRunner.query(`ALTER TABLE "translations" DROP COLUMN "jurisdiction_id"`)
    await queryRunner.query(
      `ALTER TABLE "translations" ADD "jurisdiction_id" character varying NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" DROP CONSTRAINT "UQ_60b3294568b273d896687dea59f"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "county_code" character varying NOT NULL DEFAULT 'Alameda'`
    )
    await queryRunner.query(`DROP INDEX "IDX_fe359f4430f9e0e7b278e03f0f"`)
    await queryRunner.query(`DROP INDEX "IDX_e51e812700e143101aeaabbccc"`)
    await queryRunner.query(`DROP TABLE "user_accounts_jurisdictions_jurisdictions"`)
    await queryRunner.query(
      `ALTER TABLE "translations" RENAME COLUMN "jurisdiction_id" TO "county_code"`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8317da96d5a775889e2631cc25" ON "translations" ("county_code", "language") `
    )
  }
}
