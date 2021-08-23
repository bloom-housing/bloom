import {MigrationInterface, QueryRunner} from "typeorm";

export class addsJurisdictionsListingsUserRoles1629672399504 implements MigrationInterface {
    name = 'addsJurisdictionsListingsUserRoles1629672399504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_roles_jurisdictions_jurisdictions" ("user_roles_user_id" uuid NOT NULL, "jurisdictions_id" uuid NOT NULL, CONSTRAINT "PK_91266c8b6225367bf7ea01c420c" PRIMARY KEY ("user_roles_user_id", "jurisdictions_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_567612b35665809ce09cae6554" ON "user_roles_jurisdictions_jurisdictions" ("user_roles_user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f7a8ece1821c7b154fb7bc4f59" ON "user_roles_jurisdictions_jurisdictions" ("jurisdictions_id") `);
        // assign jurisdiciton ID from county code
        await queryRunner.query(`
          UPDATE listings
          SET jurisdiction_id = j.id
          FROM listings AS l
            INNER JOIN jurisdictions AS j
              ON l.county_code = j.name
        `)
        // drop county_code from listings
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "county_code"`);
        await queryRunner.query(`ALTER TABLE "user_roles_jurisdictions_jurisdictions" ADD CONSTRAINT "FK_567612b35665809ce09cae65544" FOREIGN KEY ("user_roles_user_id") REFERENCES "user_roles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles_jurisdictions_jurisdictions" ADD CONSTRAINT "FK_f7a8ece1821c7b154fb7bc4f596" FOREIGN KEY ("jurisdictions_id") REFERENCES "jurisdictions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        // get first jurisdiction_id
        const [{ id }] = await queryRunner.query(`SELECT id FROM jurisdictions LIMIT 1`)
        // insert into user_roles_jurisdiction_jurisdictions
        await queryRunner.query(
          `INSERT INTO user_roles_jurisdictions_jurisdictions ("user_roles_user_id", "jurisdictions_id")
          SELECT user_id, '${id}' FROM user_roles`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles_jurisdictions_jurisdictions" DROP CONSTRAINT "FK_f7a8ece1821c7b154fb7bc4f596"`);
        await queryRunner.query(`ALTER TABLE "user_roles_jurisdictions_jurisdictions" DROP CONSTRAINT "FK_567612b35665809ce09cae65544"`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "county_code" character varying NOT NULL DEFAULT 'Alameda'`);
        await queryRunner.query(`DROP INDEX "IDX_f7a8ece1821c7b154fb7bc4f59"`);
        await queryRunner.query(`DROP INDEX "IDX_567612b35665809ce09cae6554"`);
        await queryRunner.query(`DROP TABLE "user_roles_jurisdictions_jurisdictions"`);
    }

}
