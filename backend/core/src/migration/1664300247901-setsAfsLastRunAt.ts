import {MigrationInterface, QueryRunner} from "typeorm";

export class setsAfsLastRunAt1664300247901 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE listings
            SET afs_last_run_at = $1
        `, [new Date()])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
