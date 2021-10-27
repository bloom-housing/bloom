import {MigrationInterface, QueryRunner} from "typeorm";

export class addsApplicantIndexToApplications1634940294580 implements MigrationInterface {
    name = 'addsApplicantIndexToApplications1634940294580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_cc9d65c58d8deb0ef5353e9037"`);
        await queryRunner.query(`CREATE INDEX "IDX_cb4467f878a127a17e52845d87" ON "applications" ("listing_id", "applicant_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_cb4467f878a127a17e52845d87"`);
        await queryRunner.query(`CREATE INDEX "IDX_cc9d65c58d8deb0ef5353e9037" ON "applications" ("listing_id") `);
    }

}
